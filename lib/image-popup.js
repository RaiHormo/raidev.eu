// Get the modal
var modal = document.getElementById("image-popup");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementsByClassName("clickable-image");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
  captionText.innerHTML = this.alt;
}


// Get the <span> element that closes the modal
var span = document.getElementById("close-popup");

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  close();
} 
modal.onclick = function() {
  close();
} 

function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.1";
    viewport.content = "width=1200";
  }
}

function show_image(el) {
    modal.style.display = "block";
    var src = el.src;
    if (src == "") {
      src = "/media/Artwork/"+el.getAttribute("filename")+".avif";
    }
    modalImg.src = src
    document.getElementById("img-meta").setAttribute("src", src);
    
    captionText.innerHTML = el.alt;
    var url = new URL(window.location.href);
    if (url.searchParams.get("artwork") != el.getAttribute("filename")) {
      url.searchParams.append("artwork", el.getAttribute("filename"));
      window.history.replaceState(null, "", url);
    }
}

function close() {
  modal.style.display = "none";
  var url = new URL(window.location.href);
  url.searchParams.delete("artwork");
  window.history.replaceState(null, "", url);
}

window.onload = function() {
  setTimeout(() => {
    var url = new URL(window.location);
    if (url.searchParams.has("artwork")) {
      var arr = Array.from(document.getElementsByClassName("clickable-image"));
      arr.forEach(element => {
        if (element.getAttribute("filename") == url.searchParams.get("artwork")) {
          show_image(element);
          return;
        }
      });
    }
  }, 100);
}