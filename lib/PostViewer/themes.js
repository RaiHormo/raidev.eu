import * as fileFetcher from "./file_fetcher.js";


var themesJson = await fileFetcher.fetchJson("./themes.json");

async function setTheme(themeArg) {
  let root = document.documentElement;
  
  for(let i = 0; i < themesJson.length; i++) {
    if(themesJson[i].name.includes(themeArg)) {
      root.style.setProperty('--main', themesJson[i].main);
      root.style.setProperty('--semi', themesJson[i].semi);
      root.style.setProperty('--text', themesJson[i].text);
    }
  } 
  
}

async function onchange_selectTheme(event) {
  localStorage.setItem("theme", event.target.value);
  
  await setTheme(event.target.value);
}

export async function pinThemeSelector() {
  let themeArg = localStorage.getItem("theme");
  themeArg = themeArg ? themeArg.toLowerCase() : null;
  
  await setTheme(themeArg);
  
  for(let i = 0; i < themesJson.length; i++) {
    var opt = document.createElement("option");
    opt.value = themesJson[i].name[0];
    opt.innerHTML = themesJson[i].name[0];
    document.getElementById("select_theme").appendChild(opt);
  }
  
  document.getElementById("select_theme").onchange = onchange_selectTheme;
  document.getElementById("select_theme").value = themeArg;
}
