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
var tag_template = $('.tag-button')[0]

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
    await new Promise(r => setTimeout(r, 100));
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
    setTimeout( function() {gallery.masonry('layout');}, "1000");
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
    var section = window.location.hash.substring(1);
    if (section == "") {
        $('.gallery-tag-title')[0].innerText = "All artwork";
        drawTagButtons();
        tag_template.style.display = 'none';
        for (var i = 0; i<imgs.length; i++) {
            var img = imgs[i];
            img.setAttribute("show", "block");
            img.style.display = 'block';
        }
    } else {
        tagPress(section);
        tag_template.style.display = 'unset';
    }
    if (tagdata(section).sketchinclude == "no") {
        for (var i = 0; i<imgs.length; i++) {
            var img = imgs[i];
            if (picdata(img).tags.find((tag) => tag == "sketch")) {
                img.setAttribute("show", "none");
                img.style.display = 'none';
            }
        }
    }
};

function tagPress(section) {
    window.location.href = "#"+section;
    $('.gallery-tag-title')[0].innerText = database.tags.find((tag) => tag.name == section).title;

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


function tagdata(wanted) {
    return database.tags.find((tag) => tag.name == wanted);
}

window.addEventListener('hashchange',() => {
    console.log("tag changed");
    tagCheck();
    waitForImages();
});

function drawTagButtons() {
    if ($(".tag-button").length == 1) {
        for (var i = 0; i<database.tags.length; i++) {
            var tag = database.tags[i];
            if (tag.name != "") {
                var btn = document.createElement('button');
                btn.classList.add('tag-button');
                btn.innerText = tag.title;
                btn.setAttribute('onclick', 'window.location.href=\'/gallery/#\'+ \''+tag.name+'\';');
                $("#tag-container").append(btn);
            }
        }
        tag_template.style.display = 'none'
    }
};
