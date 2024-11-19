//import data from '/gallery/art-database.json' with { type: "json" };
var database

$('.gallery-container').masonry({
    "columnWidth": 1,
    "itemSelector": ".gallery-img",
    "fitWidth": true
});

var imgs = new Array();

fetch('/gallery/art-database.json')
    .then(response => response.json())
    .then(async data => {
        database = data
        console.log(database.artwork);
        for (var i = 0; i< database.artwork.length; i++) {
            var img = new Image();
            var picdata = database.artwork[i];
            img.src = folder + picdata.filename + ".avif";
            await loadImage(img);
            imgs.push(img);
        
            img.setAttribute('class', "gallery-img clickable-image");
            img.setAttribute('onclick', "show_image(this);");
            var date = new Date(Date.parse(picdata.date));
            img.setAttribute("date", date);
            img.setAttribute('alt', picdata.title + " - " + date.getMonth().toString() + " "+ date.getDate());
        
            $('.gallery-container').append(img).masonry('appended', img);
            if (i % Math.round(database.artwork.length/3 || i == 6) == 0) {
                $('.gallery-container').masonry('layout');
                console.log("boing");
            }
        }
        });
var folder = "/media/Artwork/";

function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            //console.log(img.src + " loaded");
            resolve(true);
        };
    });
};
