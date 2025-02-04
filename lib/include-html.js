function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}

window.onload = function() {
  var panel = document.getElementById("slink-dropdown-panel");
  var button = document.getElementById("slink-dropdown-button");
  button.onclick = function() {
    if (panel.classList.contains("caret")) {
      panel.classList.remove("caret");
      button.classList.remove("fa-xmark");
      button.classList.remove("slink-pressed");
    } else {
      panel.classList.add("caret");
      button.classList.add("fa-solid");
      button.classList.add("fa-xmark");
      button.classList.add("slink-pressed");
    }
  };
}