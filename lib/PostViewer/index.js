import * as fileFetcher from "./file_fetcher.js";
import * as postParser from "./post_parser.js";
import * as postBase from "./post_base.js";
import * as themes from "./themes.js";

function insertStorageArg() {
  var ds = fileFetcher.getURLParams().get("direct_storage");
  var s = fileFetcher.getURLParams().get("storage");
  
  if(ds)     return `direct_storage=${ds}`;
  else if(s) return `storage=${s}`;
  return "";
}

function insertArguments(post) {
  let s = insertStorageArg();
  if(post) {
    if(s)
      return `?post=${post}&${s}`;
    else
      return `?post=${post}`;
  }
  else
    if(s)
      return `?${s}`;
    else
      return ``;
}

function snipPartitionRowPath(str) {
  return str.indexOf('\t') !== -1 ? str.substring(0,str.indexOf('\t')) : str;
}

function snipPartitionRowTitle(str) {
  return str.indexOf('\t') !== -1 ? str.substring(str.indexOf('\t') + 1) : undefined;
}

async function loadMultiplePosts(postArg) {
  let content = "";
  let contentLinks = [];
  
  try {
    contentLinks = (await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/partitions.txt`)).replaceAll('\r', '').split('\n');
  } catch (e) {
    document.getElementById("content").innerHTML = e;
    return;
  }
  
  document.getElementById("content").innerHTML = `<a href="${insertArguments()}">Back to Browser</a>`;
  
  for(let i = contentLinks.length - 1; i >= Math.max(0, contentLinks.length - postArg); i--) {
    try {
      const path = snipPartitionRowPath(contentLinks[i]);
      content = await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/posts/path}`);
      var title = postParser.parseRawTitle(content);
  
      var dateArr = path.split("_");
      var date = `${dateArr[2]}. ${dateArr[1].substring(dateArr[1].indexOf(')') + 1)}. ${dateArr[0]}`;
      document.getElementById("content").innerHTML += `<hr/><h1>${title} (${date})</h1>${postParser.parseRawPost(content)}`;
    } catch (e) {
      document.getElementById("content").innerHTML += e;  
    }
  }

  postBase.appendParsedPostToDOM(document.getElementById("content").innerHTML);
}

async function loadSinglePost(postArg) {
  let content = "";
  const path = snipPartitionRowPath(postArg);
      
  try {
    content = await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/posts/${path}`);
  } catch (e) {
    document.getElementById("content").innerHTML = e;  
    return;
  }
  
  let title = postParser.parseRawTitle(content);
  
  let dateArr = path.split("_");
  
  let date = `${dateArr[2].substr(0, 2)}. ${dateArr[1].substr(dateArr[1].indexOf(')') + 1)}. ${dateArr[0]}`;
  
  document.getElementById("content").innerHTML = postParser.parseRawPost(content);
  document.getElementById("title").innerHTML = `Post Viewer - ${title} (${date})`;
  
  postBase.appendParsedPostToDOM(document.getElementById("content").innerHTML);
}

async function loadBrowserList() {
  let content = "";
  let contentLinks = [];
  
  try {
    contentLinks = (await fileFetcher.fetchFile(`${fileFetcher.getContentLink()}/partitions.txt`)).replaceAll('\r', '').split('\n');
  } catch (e) {
    document.getElementById("content").innerHTML = e;
    return;
  }
  
  let wasTitle = snipPartitionRowTitle(contentLinks[contentLinks.length - 1]);
  
  for(let i = contentLinks.length -1; i >= 0; i--) {
    const link = snipPartitionRowPath(contentLinks[i]);
    const title = snipPartitionRowTitle(contentLinks[i]);
    
    if(wasTitle !== (title === undefined))
      document.getElementById("content").innerHTML += `<br style="clear: left;"/>`;
    
    wasTitle = (title === undefined);
    
    if(title === undefined)
      document.getElementById("content").innerHTML += `<div class="post_link"><a href="${insertArguments(link)}">${link}</a></div>`;  
    else {
      let dateArr = link.split("_");
      let date = `${dateArr[2].substr(0, 2)}. ${dateArr[1].substr(dateArr[1].indexOf(')') + 1)}. ${dateArr[0]}`;
      
      document.getElementById("content").innerHTML += `<div class="post_link"><a href="${insertArguments(link)}">${title}<br/>(${date})</a></div>`;
    }
  }
  
  document.getElementById("content").innerHTML += "<div style=\"clear: left;\">";
  
}


async function main() {
  await themes.pinThemeSelector();
  
  let postArg = fileFetcher.getURLParams().get("post");
  
  document.getElementById("back_linker").href = `index.html${insertArguments()}`;
  document.getElementById("constructor_linker").href = `constructor.html${insertArguments()}`;
  
  if(postArg == null)
    await loadBrowserList();
  else if(postArg.lastIndexOf(".") !== -1)
    await loadSinglePost(postArg);
  else
    await loadMultiplePosts(postArg);
  
}

await main();
