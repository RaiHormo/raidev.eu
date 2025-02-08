import * as fileFetcher from "./file_fetcher.js";
import * as temp from "./temp.js";

export const VERSION_SCOPE_OP = "V=>";
export const VERSION_SCOPE_CL = "<=V";

export function pickVersion(str) {
  let text = str.substr(0, str.indexOf('\n')).replaceAll('\r', '');
  
  if(text.substr(0,3) !== VERSION_SCOPE_OP)
    return "parser";
  
  return text.substr(VERSION_SCOPE_OP.length + 1, text.length - VERSION_SCOPE_OP.length - VERSION_SCOPE_CL.length - 2);
}

export function cropVersion(str) {
  if(str.indexOf("T=>") === -1 && str.indexOf("<=T") === -1)
    return str.substr(str.indexOf('\n') + 1).replaceAll('\r', '');
  else return str;
}

export function appendParsedPostToDOM(parsedContent) {
  document.getElementById("temp").innerHTML = "";

  const scriptRegexSrc = /<script type="module">(.*?)<\/script>/g;
  let match;
  while ((match = scriptRegexSrc.exec(parsedContent)) !== null) {
    const script = document.createElement("script");
    script.type = "module";
    script.src = match[1];
    document.getElementById("temp").appendChild(script);
  }

  const scriptRegexInline = /<script>(.*?)<\/script>/gs;
  while ((match = scriptRegexInline.exec(parsedContent)) !== null) {
    const scriptContent = match[1];
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = scriptContent;
    document.getElementById("temp").appendChild(script);
  }
}

