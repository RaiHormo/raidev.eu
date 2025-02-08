import * as fileFetcher from "./file_fetcher.js";
import * as PostParser from "./post_parser.js";
import * as themes from "./themes.js";
import * as postBase from "./post_base.js";

const LOCALSTORAGE_DIR = "saved_post_parser_text";
await themes.pinThemeSelector();

function insertStorageArg() {
  var ds = fileFetcher.getURLParams().get("direct_storage");
  var s = fileFetcher.getURLParams().get("storage");
  
  if(ds)     return `?direct_storage=${ds}`;
  else if(s) return `?storage=${s}`;
  return "";
}

function updateRaw(text) {
  let forced = document.getElementById("langArg").value.length ? document.getElementById("langArg").value : undefined;
  let content = "";
  try {
    content = PostParser.parseRawPost(text, forced);
  } catch(e) {
    document.getElementById("source").innerText = e;
  }

  document.getElementById("output").innerHTML = content;
  document.getElementById("title").innerText = PostParser.parseRawTitle(text, forced);
  document.getElementById("source").innerText = content;
  postBase.appendParsedPostToDOM(document.getElementById("output").innerHTML, document.getElementById("output"));
}
function update(event) {
  if(document.getElementById("checkbox_render").checked)
    updateRaw(event.target.value);
}

function save() {
  localStorage.setItem(LOCALSTORAGE_DIR, document.getElementById("input").value);
  alert("text was saved!");
}

function setAutoRender(e) {
  document.getElementById("button_force_render").disabled = e.target.checked;
}

document.getElementById("buttonSave").onclick = save;

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.which === 83) {
    e.preventDefault();
    save();
  }
});

document.getElementById("checkbox_render").onchange = setAutoRender;
document.getElementById("button_force_render").onclick = () => updateRaw(document.getElementById("input").value);

document.getElementById("input").onkeyup = update;

if (localStorage.getItem(LOCALSTORAGE_DIR) === undefined) {
  localStorage.setItem(LOCALSTORAGE_DIR, document.getElementById("input").value);
}
else {
  document.getElementById("input").value = localStorage.getItem(LOCALSTORAGE_DIR);
}

document.getElementById("langArg").onchange = () => {
  updateRaw(document.getElementById("input").value);
}

document.getElementById("back_linker").href = `index.html${insertStorageArg()}`

updateRaw(localStorage.getItem(LOCALSTORAGE_DIR));