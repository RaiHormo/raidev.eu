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
modal.onmouseup = function() {
  if (modalImg.style.scale == 1)
    close();
}
modalImg.addEventListener('wheel', function(event){
  modalImg.style.scale = Math.min(Math.max(parseFloat(modalImg.style.scale) + event.deltaY/1000, 1), 10);
})

modalImg.addEventListener('mousedown', function (event) {
  if (modalImg.style.scale > 1) {
    console.log(event.cliHeiinnerHeight)
  }
})

function zoomOutMobile() {
  var viewport = document.querySelector('meta[name="viewport"]');

  if ( viewport ) {
    viewport.content = "initial-scale=0.1";
    viewport.content = "width=1200";
  }
}

function show_image(el) {
  modalImg.style.scale = 1;
  modal.style.display = "block";
  modal.style.opacity = "100%"
  document.body.style.overflow = "hidden";
  var src = el.src;
  if (src == "") {
    src = "/media/Artwork/"+el.getAttribute("filename")+".avif";
  }
  modalImg.src = src
  document.getElementById("img-meta").setAttribute("src", src);
  
  captionText.children[0].innerHTML = el.alt;
  captionText.children[1].innerHTML = el.getAttribute("date-text");
  var tag_temp = captionText.children[2].children[0]
  Array.from(captionText.children[2].children).forEach(element => {
    captionText.children[2].removeChild(element);
  })
  var tags = el.getAttribute("tags").split(',')
  tags.forEach(tag => {
    tag_temp.textContent = tag
    captionText.children[2].appendChild(tag_temp.cloneNode(true))
  })
  var url = new URL(window.location.href);
  if (url.searchParams.get("artwork") != el.getAttribute("filename")) {
    url.searchParams.append("artwork", el.getAttribute("filename"));
    window.history.replaceState(null, "", url);
  }
}

function close() {
  document.body.style.overflow = null;
  var url = new URL(window.location.href);
  url.searchParams.delete("artwork");
  window.history.replaceState(null, "", url);
  modal.style.opacity = null
  modalImg.style.animationDirection = "reverse";
  captionText.style.animationDirection = "reverse";
  modalImg.style.animationName = 'none';
  modalImg.offsetHeight; /* trigger reflow */
  modalImg.style.animationName = "zoom";
  captionText.style.animationName = 'none';
  captionText.offsetHeight; /* trigger reflow */
  captionText.style.animationName = "zoom";
  if (document.getElementsByClassName("gallery-container")[0] != null) {
    waitForImages();
  }
  setTimeout(() => {
    modal.style.display = "none";
    modalImg.style.animationDirection = null;
    captionText.style.animationDirection = null;
    modalImg.setAttribute("src", "");
  }, 300);
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
  }, 200);
}