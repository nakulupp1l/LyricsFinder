const express = require('express');
const bodyParser = require('body-parser');
const http = require("https");
const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static('public'));

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post("/", (req, res) => {
    console.log(req.body.search)
    var search = toUrl(req.body.search)
    console.log(search);
    
    const options = {
        "method": "GET",
        "hostname": "genius-song-lyrics1.p.rapidapi.com",
        "port": null,
        "path": "/search/?q=" + search + "&per_page=10&page=1",
        "headers": {
            "X-RapidAPI-Key": "db9607d3c8msh491caaf8e7a77b3p1715f7jsnd823e9611a94",
            "X-RapidAPI-Host": "genius-song-lyrics1.p.rapidapi.com",
            "useQueryString": true
        }
    };

    const request = http.request(options, function (response) {
        const chunks = [];
        // console.log(response);

        response.on("data", function (chunk) {
            chunks.push(chunk);
        });

        response.on("end", function () {
            const body = Buffer.concat(chunks);
            var json = JSON.parse(body.toString());
            var output = {
                "length" : json.hits.length,
                "images" : [],
                "titles" : [],
                "artistName" : [],
                "url" : []
            }
            // var images = [];
            // var titles = [];
            // var artistName = [];
            // var url = [];
            for (let i = 0; i < json.hits.length; i++) {
                output.images.push(json.hits[i].result.header_image_thumbnail_url)
            }
            for (let j= 0; j < json.hits.length; j++) {
                output.titles.push(json.hits[j].result.full_title)
            }
            for (let k = 0; k < json.hits.length; k++) {
                output.artistName.push(json.hits[k].result.artist_names)
            }
            for (let l = 0; l < json.hits.length; l++) {
                output.url.push(json.hits[l].result.relationships_index_url)
            }
            // for (let l = 0; l < json.hits.length; l++) {
            //     // console.log(json.hits[l].result)
            //     console.log(output.url[l])
            // }

            // res.render('cardPage', {
            //     titles: titles,
            //     images: images,
            //     artistName: artistName,
            //     url: url
            // });
            console.log(output.length);
            res.render('cardPage', {
                data: output
            })

            // console.log(hits);
            // console.log(body.toString().hits[0].result.full_title);
            // console.log(body.hits[0].toString());
        });
    });


// res.sendFile(__dirname + "/views/cardPage.ejs")

request.end();

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function toUrl(search)
{
    var str="";
    for(var i = 0; i<search.length; i++)
    {
        if(search.charAt(i)==" ")
            str+="%20";
        else 
            str+=search.charAt(i);
    
    }
    return str;
}
