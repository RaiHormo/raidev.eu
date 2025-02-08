import * as fileFetcher from "./file_fetcher.js";
import * as temp from "./temp.js";
import* as postBase from "./post_base.js";

/*
V=> rocket <=V
-- title --
~>
text in div
~&>
html code
~I>
./image/symbol of currency S.png
~JS>
js code
~CSS>
also css

~>
enter


~>
double enter

~&=
  <div id="abc">
  ~I>
  ./image/symbol of currency S.png
  ~>
  man doin this stuff is insane
  =
  </div>
=>

~|
more line text
lines!
|>

~L)https://ivan-krul.github.io/PostViewer/index.html)>
da link

*/

export const VERSION_IMPORT = "rocket";

export const DICTIONARY = {
  "TITLE_OPEN": "-- ",
  "TITLE_CLOS": " --",

  "ROCKET_FLAME": "~",
  "ROCKET_TIP"  : ">",
  "ROCKET_BODY" : "=",
  "ROCKET_FUEL" : "|",
  "ROCKET_RADAR": ")",
  "ROCKET_LOADS": {
    "HTML": "&",
    "IMAGE": "I",
    "IMAGE_LOCAL": "IL",
    "LINK": "L",
    "CSS": "CSS",
    "JS": "JS",
    "JS_MOD": "JS&",
  }
};

export const EMPTY_LOAD_UNWRAP = "div";

function loadBottomPayload(payload) {
  if(payload === "" || payload === DICTIONARY.ROCKET_LOADS.HTML)
    return `<${EMPTY_LOAD_UNWRAP}>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.IMAGE)
    return `<image src="`;
  else if(payload === DICTIONARY.ROCKET_LOADS.IMAGE_LOCAL)
    return `<image src="${fileFetcher.getContentLink()}/image/`;
  else if(payload.substr(0,DICTIONARY.ROCKET_LOADS.LINK.length) === DICTIONARY.ROCKET_LOADS.LINK)
    return `<a target="_blank" href="`;
  else if(payload === DICTIONARY.ROCKET_LOADS.CSS)
    return `<style>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.JS)
    return `<script>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.JS_MOD)
    return `<script type="module">`;
  else
    return `<${EMPTY_LOAD_UNWRAP}>`;
}

function loadTopPayload(payload) {
  if(payload === "" || payload === DICTIONARY.ROCKET_LOADS.HTML)
    return `</${EMPTY_LOAD_UNWRAP}>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.IMAGE)
    return `">`;
  else if(payload === DICTIONARY.ROCKET_LOADS.IMAGE_LOCAL)
    return `">`;
  else if(payload.substr(0,DICTIONARY.ROCKET_LOADS.LINK.length) === DICTIONARY.ROCKET_LOADS.LINK)
    return `</a>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.CSS)
    return `</style>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.JS)
    return `</script>`;
  else if(payload === DICTIONARY.ROCKET_LOADS.JS_MOD)
    return `</script type="module">`;
  else
    return `</${EMPTY_LOAD_UNWRAP}>`;
}

export function parseRawTitle(str = "") {
  let text = str.substr(str.indexOf('\n') + 1);
  
  text = text.substr(0, text.indexOf('\n')).replaceAll('\r', '');
  
  text.trim();
  
  if(text.substr(0, DICTIONARY.TITLE_OPEN.length) === DICTIONARY.TITLE_OPEN && text.substr(text.substr.length - DICTIONARY.TITLE_CLOS.length - 2) === DICTIONARY.TITLE_CLOS) {
    return text.substr(3, text.length - 6);
  }
  
  return "undefined";
}

export function parseRawPost(str = "") {
  var splits = postBase.cropVersion(str).split('\n');
  var res_str = "";
  var payload = "";
  var skips = 0;
  var line = 0;
  var inlines = [];
  var tip = "";
  var loops = 0;
  
  splits.shift();
  
  if(splits[line].substr(0, DICTIONARY.TITLE_OPEN.length) === DICTIONARY.TITLE_OPEN) splits.shift();
  
  while(line < splits.length && loops < 1024) {
    var current_line = splits[line];
    
    if(current_line.length === 0)  {
      line++;
      skips++;
      if(skips > 1) res_str += "<br>";
      continue;
    }
    
    current_line = splits[line].trim();
    
    skips = 0;
    
    if(current_line[0] === DICTIONARY.ROCKET_FLAME[0]) {
      payload = current_line.substr(1, splits[line].length - 2);
      tip = current_line[current_line.length - 1];
      res_str += loadBottomPayload(payload);
      
      if(tip === DICTIONARY.ROCKET_BODY[0]) {
        inlines.push(payload);
        res_str += `${splits[line+1]} `;
        line+=2;
      }
      else if(tip === DICTIONARY.ROCKET_FUEL[0]) {
        if(payload[0] === DICTIONARY.ROCKET_LOADS.LINK[0]) {
          console.error("The fuel rocket can't carry a link inside");
          throw "ERROR: The fuel rocket can't carry a link inside";
        }
        line++;
        while(splits[line][0] !== DICTIONARY.ROCKET_FUEL[0]) {
          res_str += `${splits[line]} `;
          line++;
        }
        res_str += loadTopPayload(payload);
        line++;
      }
      else if(payload[payload.length - 1] === DICTIONARY.ROCKET_RADAR[0]) {
        let indx = payload.indexOf(DICTIONARY.ROCKET_RADAR[0]);
        let link = payload.substr(indx + 1, payload.length - indx - 2);
        
        res_str += link;
        line++;
        res_str += `">${splits[line]}`;
        res_str += loadTopPayload(payload);
        line++;
      }
      else if(tip === DICTIONARY.ROCKET_TIP[0]) {
        res_str += `${splits[line+1].trim()}`;
        res_str += loadTopPayload(payload);
        line+=2;
      }
      else {
        console.error("The rocket should have the tip or the body and then the tip");
        throw "ERROR: The rocket should have the tip or the body and then the tip";
      }
    }
    else if(current_line[0] === DICTIONARY.ROCKET_BODY[0]) {
      if(current_line[current_line.length - 1] === DICTIONARY.ROCKET_BODY[0]) {
        res_str += `${splits[line+1]} `;
        line+=2;
      }
      else if(current_line[current_line.length - 1] === DICTIONARY.ROCKET_TIP[0]){
        payload = inlines.pop();
        res_str += loadTopPayload(payload);
        line++;
      }
      
    }
    else {
      console.error("It's not even the rocket!");
      throw "ERROR: It's not even the rocket!";
    }
    
    loops++;
  }
  
  return res_str;
}


