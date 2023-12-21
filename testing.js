const fs = require('fs')

function getTitle() {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }
  let result = "";
  for(let i = 2; i < process.argv.length; ++i){
    result += process.argv[i];
    if(process.argv.length - 1 !== i){
      result += " ";
    }
  }
  return result;
}

async function getTextID(title) {
  let textID = 0;
  try {
    const res = await fetch(`https://itell-strapi-um5h.onrender.com/api/texts`, {cache: "no-store"});
    let data = await res.json();


    for (let i = 0; i < data["data"].length; ++i) {
      let curData = data["data"][i]["attributes"];
      if (curData["Title"] === title) {
        textID = data["data"][i]["id"];
      }
    }
  }
  catch (err){
    console.log(err);
  }
  return textID;
}

async function getTextData(textID) {
      const res = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=*', {cache: "no-store"});
      let data = await res.json();

      return data["data"]["attributes"];
}

function makeDir(path) {
  if(!fs.existsSync(path)){
    fs.mkdir(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
}

async function entryPages(textData, startingPath) {

  for (let i = 0; i < textData.length; ++i) {
    let page = textData[i];

    let path = startingPath;
    let stream;

    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + textData[i]["id"] + '?populate=*', {cache: "no-store"});
    let data = await res.json();

    let pageData = data["data"]["attributes"];

    if (i !== 0) {
      path = startingPath + "section-" + i + ".mdx";
      stream = fs.createWriteStream(path);
      stream.write("---\ntitle: \"" + pageData["Title"] +"\""
        + "\npage_slug: " + pageData["slug"]
        +"\nquiz: " + (pageData["Quiz"]["data"]!==null)
        + "\n---\n");
    } else {
      path = startingPath + "index.mdx";
      stream = fs.createWriteStream(path);
      stream.write("---\ntitle: " + pageData["Title"]
      + "\npage_slug: " + pageData["slug"]
      +"\nquiz: " + (pageData["Quiz"]["data"]!==null)
      + "\n---\n");
    }

    for (let l = 0; l < pageData["Content"].length; ++l) {

      let curChunk = pageData["Content"][l];
      if (curChunk["__component"] === "page.chunk" || curChunk["__component"] === "page.plain-chunk") {
        let chunkSlug=curChunk["Slug"];
        if(curChunk["Slug"]!=null){
          chunkSlug=chunkSlug.replaceAll("\"", '');
        }
        else{
          chunkSlug = ""
        }

        let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + chunkSlug + "\">\n";
        stream.write(inputString);
        if(curChunk["MDX"] != null){
          const newText = curChunk["MDX"].replaceAll("$", "\\$");
          stream.write(newText);
        }
        stream.write("\n</div>\n");
      } else if (curChunk["__component"] === "page.video") {
      }
    }
    stream.end();
  }
}

async function makeModules(textData) {
  let newTextData = textData["modules"]["data"];
  for (let i = 0; i < newTextData.length; ++i) {
    makeDir("./output/module-" + (i + 1));
    let res = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/'+textData["modules"]["data"][i]["id"]+'?populate=chapters', {cache: "no-store"});
    let data = await res.json();

    let modulesData = data["data"]["attributes"]["chapters"]["data"];
    let chapterPath;
    for (let j = 0; j < modulesData.length; ++j) {
      if(modulesData[j]["attributes"]["ChapterNumber"]==null){
        chapterPath="./output/module-" + (i + 1)+"/chapter-" + (j+1)+"/";
      }
      else{
        chapterPath="./output/module-" + (i + 1)+"/chapter-" + modulesData[j]["attributes"]["ChapterNumber"]+"/";
      }
      makeDir(chapterPath);
      let chapterID=modulesData[j]["id"];

      res = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/'+chapterID+'?populate=pages', {cache: "no-store"});
      data = await res.json();

      let chapterData = data["data"]["attributes"]["pages"]["data"];
      await entryPages(chapterData,chapterPath);
    }
  }
}

async function makeChapters(textData) {
  let newTextData = textData["chapters"]["data"];
  let chapterPath;
  for (let i = 0; i < newTextData.length; ++i) {
    if(newTextData[i]["attributes"]["ChapterNumber"]==null){
      chapterPath="./output/chapter-" + (j+1)+"/";
    }
    else{
      chapterPath="./output/chapter-" + newTextData[i]["attributes"]["ChapterNumber"]+"/";
    }
    makeDir(chapterPath);
    let chapterID=newTextData[i]["id"];

    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/'+chapterID+'?populate=pages', {cache: "no-store"});
    let data = await res.json();

    let chapterData = data["data"]["attributes"]["pages"]["data"];
    await entryPages(chapterData,chapterPath);
  }
}

async function run() {
  let title = getTitle();
  let textID = await getTextID(title);
  if(textID === 0){
    return;
  }

  let textData = await getTextData(textID);

  let hasModules = textData["modules"]["data"].length > 0;
  let hasChapters = textData["chapters"]["data"].length > 0;

  if(hasModules){
    await makeModules(textData);
  }
  else if(hasChapters){
    await makeChapters(textData);
  }
  else{
    await entryPages(textData["chapters"]["data"],"output/");
  }
}

run();
