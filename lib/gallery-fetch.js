//import data from '/gallery/art-database.json' with { type: "json" };
var database

$('.gallery-container').masonry({
    "columnWidth": 1,
    "itemSelector": ".gallery-img",
    "fitWidth": true,
    percentPosition: true
});

var imgs = new Array();
var gallery = $('.gallery-container')
var loader = $('.gallery-loader')[0]
var folder = "/media/Artwork/";

fetch('/gallery/art-database.json')
    .then(response => response.json())
    .then(async data => {
        database = data
        for (var i = 0; i< database.artwork.length; i++) {
            var img = new Image();
            var picdata = database.artwork[i];
            imgs.push(img);

            img.setAttribute('class', "clickable-image gallery-img");
            img.setAttribute('onclick', "show_image(this);");
            var date = new Date(Date.parse(picdata.date));
            img.setAttribute("date", Date.parse(picdata.date));
            img.setAttribute("filename", picdata.filename);
            img.setAttribute('alt', picdata.title + " - " + date.toLocaleString('en-us', { month: 'short' }) + " "+ date.getDate() + " "+ date.getFullYear());
        
            imgs.sort(function(x, y) {
                if (x.getAttribute("date") > y.getAttribute("date")) return -1;
                if (x.getAttribute("date") < y.getAttribute("date")) return 1;
                return 0
            });
        }
        for (var i = 0; i<imgs.length; i++) {            
            var img = imgs[i];
            var placeholder = new Image()
            placeholder.src = folder + img.getAttribute("filename") + ".avif";
            img.style.aspectRatio = placeholder.naturalWidth+"/"+placeholder.naturalHeight; 
            
        }
        console.log(imgs);
        loader.style.display = 'none';
        for (var i = 0; i< imgs.length; i++) {
            var img = imgs[i];
            gallery.append(img).masonry('appended', img);
        }
        gallery.masonry('layout');
        for (var i = 0; i<imgs.length; i++) {  
            var img = imgs[i];
            img.src = folder + img.getAttribute("filename") + ".avif";
            await loadImage(img);
        }
        gallery.masonry('layout');
        console.log("loaded");
        });

function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            console.log(img.src + " loaded");
            resolve(true);
        };
    });
};
