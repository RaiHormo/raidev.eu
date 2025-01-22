// Get the bg
var bg = document.getElementById("profile-popup");

// Get the image and insert it inside the bg - use its "alt" text as a caption
var btn = document.getElementsByClassName("profile-button");
btn.onclick = function(){
  bg.style.display = "block";
}

// Get the <span> element that closes the bg
var span = document.getElementById("close-popup");

// When the user clicks on <span> (x), close the bg
span.onclick = function() {
  bg.style.display = "none";
}

function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.1";
    viewport.content = "width=1200";
  }
}

function profile(el) {
    bg.style.display = "block";
    bgImg.src = el.src;
    captionText.innerHTML = el.alt;
}