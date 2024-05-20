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
  modal.style.display = "none";
} 

function show_image(el) {
    modal.style.display = "block";
    modalImg.src = el.src;
    captionText.innerHTML = el.alt;
}