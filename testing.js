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

async function entryModules(textData) {
  let newTextData = textData["modules"]["data"];
  for (let i = 0; i < newTextData.length; ++i) {
    // let moduleSlug = newTextData[i]["attributes"]["slug"];
    makeDir("./output/module-" + (i + 1));
  }

  await entryChapters(textData, true);
}

async function entryChapters(textData, hasModules) {
  textData = textData["chapters"]["data"]
  for (let i = 0; i < textData.length; ++i) {
    let path = "./output/";
    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/' + textData[i]["id"] + '?populate=*', {cache: "no-store"});
    let data = await res.json();

    let chapterData = data["data"]["attributes"];

    // if(hasModules){
    //   path += data["data"]["attributes"]["module"]["data"]["attributes"]["slug"] + "/"
    // }
    // else{
      path += "module-1/"
    // }

    // path += chapterData["slug"] + "/";
    path += "chapter-" + (i + 1) + "/";
    makeDir(path);
    await entryPages(data["data"]["attributes"]["pages"]["data"], path);
  }
}

async function entryPages(textData, startingPath) {

  for (let i = 0; i < textData.length; ++i) {
    let page = textData[i];

    let path = startingPath;
    let stream;

    if (i !== 0) {
      path = startingPath + "section-" + i + ".mdx";
      stream = fs.createWriteStream(path);
      stream.write("---\ntitle: " + page["attributes"]["Title"]
        // + "\nsummary: true\nqa: false\npage_slug: " + page["attributes"]["slug"]
        + "\n---\n");
      // await fs.appendFile(path, "---\ntitle: " + page["attributes"]["Title"]
      //   // + "\nsummary: true\nqa: false\npage_slug: " + page["attributes"]["slug"]
      //   + "\n---\n", (err) => {
      //   if (err)
      //     console.log(err);
      // });
    } else {
      path = startingPath + "index.mdx";
      stream = fs.createWriteStream(path);
      stream.write("---\ntitle: " + page["attributes"]["Title"]
        // + "\nsummary: false\nqa: true\npage_slug: " + page["attributes"]["slug"]
        + "\n---\n");
      // await fs.appendFile(path, "---\ntitle: " + page["attributes"]["Title"]
      //   // + "\nsummary: false\nqa: true\npage_slug: " + page["attributes"]["slug"]
      //   + "\n---\n", (err) => {
      //   if (err)
      //     console.log(err);
      // });
    }



    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + textData[i]["id"] + '?populate=Content', {cache: "no-store"});
    let data = await res.json();

    let pageData = data["data"]["attributes"];

    for (let l = 0; l < pageData["Content"].length; ++l) {

      let curChunk = pageData["Content"][l];
      if (curChunk["__component"] === "page.chunk") {
        let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curChunk["Slug"] + "\">\n";
        stream.write(inputString);
        if(curChunk["MDX"] != null){
          stream.write(curChunk["MDX"]);
        }
        stream.write("\n</div>\n");
        // await fs.appendFile(path, curChunk["MDX"], (err) => {
        //   if (err)
        //     console.log("3" + err);
        // });
        // await fs.appendFile(path, "\n</div>\n", (err) => {
        //   if (err)

        //     console.log("3" + err);
        // });
      } else if (curChunk["__component"] === "page.video") {
      }
    }

    stream.end();
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
    await entryModules(textData);
  }
  else if(hasChapters){
    await entryChapters(textData, false);
  }
  else{
    await entryPages(textData["pages"]["data"], "./output/");
  }
}

run();
