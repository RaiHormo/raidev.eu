
function createTemp() {
  if(document.getElementById("temp")) {} else {
    document.body.innerHTML += `<div id="temp"></div>`;
  }
}

createTemp();
export var tempTag = document.getElementById("temp");


