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
    .then(data => {
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
            img.style.display = 'none';

            imgs.sort(function(x, y) {
                if (x.getAttribute("date") > y.getAttribute("date")) return -1;
                if (x.getAttribute("date") < y.getAttribute("date")) return 1;
                return 0
            });
        }
        tagCheck();
        console.log(imgs);
        for (var i = 0; i< imgs.length; i++) {
            var img = imgs[i];
            gallery.append(img).masonry('appended', img);
            img.style.display = img.getAttribute("show");
        }
        waitForImages();
        });

async function waitForImages() {
    for (var i = 0; i<imgs.length; i++) {
        var img = imgs[i];
        if (img.getAttribute("show") == "block") {
            img.src = folder + img.getAttribute("filename") + ".avif";
            img.style.aspectRatio = img.naturalWidth+"/"+img.naturalHeight;
        }
    }
    gallery.masonry('layout');
    for (var i = 0; i<imgs.length; i++) {
        var img = imgs[i];
        if (img.getAttribute("show") == "block") {
            img.src = folder + img.getAttribute("filename") + ".avif";
            // if (fileExists(placeholder.src))
            await loadImage(img);
            if (i == 6) {
                gallery.masonry('layout');
                loader.style.display = 'none';
            }
        }
    }
    gallery.masonry('layout');
    console.log("loaded");
    loader.style.display = 'none';
};

function loadImage(img) {
    img.style.aspectRatio = img.naturalWidth+"/"+img.naturalHeight;
    if (img.complete) return;
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            console.log(img.getAttribute("filename") + " loaded");
            resolve(true);
        };
    });
};

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        return req.status==200;
    } else {
        return false;
    }
};

function tagCheck() {
    if (window.location.hash.substring(1) == "") {
        for (var i = 0; i<imgs.length; i++) {
            var img = imgs[i];
            img.setAttribute("show", "block");
            img.style.display = 'block';
        }
    } else {
        tagPress(window.location.hash.substring(1));
    }
};

function tagPress(section) {
    window.location.href = "#"+section;

    window.scrollTo(0,-50)
    for (var i = 0; i<imgs.length; i++) {
        var img = imgs[i];
        var data = picdata(img);
        if (data.tags.find((tag) => tag == section) != undefined) {
            img.setAttribute('show', "block");
            img.style.display = 'block';
        } else {
            img.setAttribute('show', "none");
            img.style.display = 'none';
        }
    };
    console.log("tag check done");
};

function picdata(img) {
    return database.artwork.find( (data) =>
        data.filename == img.getAttribute("filename")
    )
};

window.addEventListener('hashchange',() => {
    console.log("tag changed");
    tagCheck();
    waitForImages();
});