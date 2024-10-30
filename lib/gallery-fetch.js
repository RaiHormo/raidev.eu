//import data from '/gallery/art-database.json' with { type: "json" };
var database
fetch('/gallery/art-database.json')
    .then(response => response.json())
    .then(data => {
        database = data});
console.log(database.artwork[0]);
var folder = "/media/Artwork";

$('.gallery-container').masonry({
    "columnWidth": 1,
    "itemSelector": ".gallery-img",
    "fitWidth": true
});

var imgs = new Array();

$.ajax({
    url : folder,
    success: async function (data) {
        $(data).find("a").attr("href", function (i, val) {
            if( val.match(/\.(jpe?g|png|gif|avif|webp)$/) ) { 
                imgs.push(val);
            }
        });
        for (let i = 0; i < imgs.length; i++) {
            var img = new Image();
            img.src = imgs[i];
            await loadImage(img);
            img.setAttribute('class', "gallery-img clickable-image");
            img.setAttribute('onclick', "show_image(this);");
            //img.setAttribute('alt', $(data).getFile(val).getMetadata())
            $('.gallery-container').append(img).masonry('appended', img);
            $('.gallery-container').masonry('layout');
        }
    }
});

function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            //console.log(img.src + " loaded");
            resolve(true);
        };
    });
};
