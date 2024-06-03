const fs = require('fs')

let hasModules = true;
let hasChapters = true;

function getTextID() {
  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }
  return process.argv[2];
}

async function getTextData(textID) {
  const res = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=*&publicationState=live', {cache: "no-store"});
  let data = await res.json();

  if(data["data"] == null){
    process.exit(1);
  }

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

    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + textData[i]["id"] + '?populate=*&publicationState=live', {cache: "no-store"});
    let data = await res.json();

    let pageData = data["data"]["attributes"];

    if(hasChapters){
      if (i !== 0) {
        path = startingPath + "section-" + i + ".mdx";
        stream = fs.createWriteStream(path);
        stream.write("---\ntitle: \"" + pageData["Title"] +"\""
          + "\npage_slug: " + pageData["slug"]
          +"\nsummary: " + pageData["HasSummary"]
          +"\nquiz: " + (pageData["Quiz"]["data"]!==null)
          + "\nreference_summary: " + pageData["ReferenceSummary"]
          + "\n---\n");
      } else {
        path = startingPath + "index.mdx";
        stream = fs.createWriteStream(path);
        stream.write("---\ntitle: \" " + pageData["Title"]+"\""
          + "\npage_slug: " + pageData["slug"]
          +"\nsummary: " + pageData["HasSummary"]
          +"\nquiz: " + (pageData["Quiz"]["data"]!==null)
          + "\n---\n");
      }
    }
    else{
      path = startingPath + "chapter-" + i + ".mdx";
      stream = fs.createWriteStream(path);
      stream.write("---\ntitle: \"" + pageData["Title"] +"\""
        + "\npage_slug: " + pageData["slug"]
        +"\nsummary: " + pageData["HasSummary"]
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

        let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + chunkSlug + "\" ";
        stream.write(inputString);
        if(curChunk["ShowHeader"] === true) {
          stream.write("show-header = \"true\">\n");
          if(curChunk["HeaderLevel"] === "H3"){
            stream.write("### "+curChunk["Header"]+"\n");
          }
          else if(curChunk["HeaderLevel"] === "H4"){
            stream.write("#### "+curChunk["Header"]+"\n");
          }
          else{
            stream.write("## "+curChunk["Header"]+"\n");
          }
        }
        else{
          stream.write("show-header = \"false\">\n");
        }
        if(curChunk["MDX"] != null){
          stream.write(curChunk["MDX"].replace(/[\u200B-\u200D\uFEFF]/g, ''));
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
    let res = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/'+textData["modules"]["data"][i]["id"]+'?populate=chapters&publicationState=live', {cache: "no-store"});
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

      res = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/'+chapterID+'?populate=pages&publicationState=live', {cache: "no-store"});
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
      chapterPath="./output/chapter-" + (i+1)+"/";
    }
    else{
      chapterPath="./output/chapter-" + newTextData[i]["attributes"]["ChapterNumber"]+"/";
    }
    makeDir(chapterPath);
    let chapterID=newTextData[i]["id"];

    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/'+chapterID+'?populate=pages&publicationState=live', {cache: "no-store"});
    let data = await res.json();

    let chapterData = data["data"]["attributes"]["pages"]["data"];
    await entryPages(chapterData,chapterPath);
  }
}

async function run() {
  let textID = getTextID();
  // let textID = await getTextID(title);
  // if(textID === 0){
  //   return;
  // }

  let textData = await getTextData(textID);

  hasModules = textData["modules"]["data"].length > 0;
  hasChapters = textData["chapters"]["data"].length > 0;

  if(hasModules){
    await makeModules(textData);
  }
  else if(hasChapters){
    await makeChapters(textData);
  }
  else{
    await entryPages(textData["pages"]["data"],"output/");
  }
}

run();

