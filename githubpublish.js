const fs = require("fs");

let hasModules = true;
let hasChapters = true;

function getTextID() {
  if (process.argv.length === 2) {
    console.error("Expected at least one argument!");
    process.exit(1);
  }
  return process.argv[2];
}

async function getTextData(textID) {
  const res = await fetch(
    `https://itell-strapi-um5h.onrender.com/api/texts/${textID}?populate=*`,
    { cache: "no-store" },
  );

  let data = await res.json();

  if (data["data"] == null) {
    process.exit(1);
  }

  return data["data"]["attributes"];
}

function makeDir(path) {
  if (!fs.existsSync(path)) {
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

    const res = await fetch(
      "https://itell-strapi-um5h.onrender.com/api/pages?filters[Slug][$eq]=" +
        textData[i]["attributes"]["Slug"] +
        "&populate=*",
      { cache: "no-store" },
    );
    let data = await res.json();

    let pageData = data["data"][0]["attributes"];

    if (hasChapters) {
      if (i !== 0) {
        path = startingPath + "section-" + i + ".mdx";
        stream = fs.createWriteStream(path);
        stream.write(
          '---\ntitle: "' +
            pageData["Title"] +
            '"' +
            "\npage_slug: " +
            pageData["Slug"] +
            "\nsummary: " +
            pageData["HasSummary"] +
            "\nquiz: " +
            (pageData["Quiz"]["data"] !== null) +
            "\nreference_summary: " +
            pageData["ReferenceSummary"] +
            "\n---\n",
        );
      } else {
        path = startingPath + "index.mdx";
        stream = fs.createWriteStream(path);
        stream.write(
          '---\ntitle: " ' +
            pageData["Title"] +
            '"' +
            "\npage_slug: " +
            pageData["Slug"] +
            "\nsummary: " +
            pageData["HasSummary"] +
            "\nquiz: " +
            (pageData["Quiz"]["data"] !== null) +
            "\n---\n",
        );
      }
    } else {
      path = startingPath + "chapter-" + i + ".mdx";
      stream = fs.createWriteStream(path);
      stream.write(
        '---\ntitle: "' +
          pageData["Title"] +
          '"' +
          "\npage_slug: " +
          pageData["Slug"] +
          "\nsummary: " +
          pageData["HasSummary"] +
          "\nquiz: " +
          (pageData["Quiz"]["data"] !== null) +
          "\n---\n",
      );
    }

    for (let l = 0; l < pageData["Content"].length; ++l) {
      let curChunk = pageData["Content"][l];
      if (
        curChunk["__component"] === "page.chunk" ||
        curChunk["__component"] === "page.plain-chunk"
      ) {
        let chunkSlug = curChunk["Slug"];
        if (curChunk["Slug"] != null) {
          chunkSlug = chunkSlug.replaceAll('"', "");
        } else {
          chunkSlug = "";
        }

        let inputString = `<section className="content-chunk" aria-labelledby="${chunkSlug}" data-subsection-id="${chunkSlug}"`;
        stream.write(inputString);
        if (curChunk.ShowHeader) {
          stream.write(` data-show-header="true">\n\n`);
          if (curChunk.HeaderLevel === "H3") {
            stream.write(`### ${curChunk.Header} \\{#${chunkSlug}}\n\n`);
          } else if (curChunk.HeaderLevel === "H4") {
            stream.write(`#### ${curChunk.Header} \\{#${chunkSlug}}\n\n`);
          } else {
            stream.write(`## ${curChunk.Header} \\{#${chunkSlug}}\n\n`);
          }
        } else {
          stream.write(` data-show-header="false">\n\n`);
          stream.write(
            `<h2 className="sr-only" id="${chunkSlug}">${curChunk.Header}</h2>\n\n`,
          );
        }
        if (curChunk.MDX != null) {
          stream.write(
            /*
            Replaces:
            1. 0 width space characters
            2. <br> in old html embed components (legacy)
            3. Adds pageSlugs to sandboxes
            4. Adds pageSlugs to sandboxes (legacy) 
             */
            curChunk.MDX.replaceAll(/[\u200B-\u200D\uFEFF\u00A0]/g, "")
              .replaceAll(/(<br\s*\/?>\s*)+/g, "\n\n")
              .replaceAll("__temp_slug__", pageData["Slug"])
              .replaceAll("test-page-no-chunks", pageData["Slug"]),
          );
        }
        stream.write("\n\n</section>\n\n");
      } else if (curChunk["__component"] === "page.video") {
      }
    }
    stream.end();
  }
}

async function makeModules(textData) {
  let newTextData = textData["Modules"]["data"];
  for (let i = 0; i < newTextData.length; ++i) {
    makeDir("./output/module-" + (i + 1));
    let res = await fetch(
      "https://itell-strapi-um5h.onrender.com/api/modules?filters[Slug][$eq]=" +
        textData["modules"]["data"][i]["attributes"]["Slug"] +
        "&populate=chapters",
      { cache: "no-store" },
    );
    let data = await res.json();

    let modulesData = data["data"]["attributes"]["Chapters"]["data"];
    let chapterPath;
    for (let j = 0; j < modulesData.length; ++j) {
      if (modulesData[j]["attributes"]["ChapterNumber"] == null) {
        chapterPath =
          "./output/module-" + (i + 1) + "/chapter-" + (j + 1) + "/";
      } else {
        chapterPath =
          "./output/module-" +
          (i + 1) +
          "/chapter-" +
          modulesData[j]["attributes"]["ChapterNumber"] +
          "/";
      }
      makeDir(chapterPath);
      let chapterSlug = modulesData[j]["attributes"]["Slug"];

      res = await fetch(
        "https://itell-strapi-um5h.onrender.com/api/chapters?filters[Slug][$eq]=" +
          chapterSlug +
          "&populate=pages",
        { cache: "no-store" },
      );
      data = await res.json();

      let chapterData = data["data"]["attributes"]["pages"]["data"];
      await entryPages(chapterData, chapterPath);
    }
  }
}

async function makeChapters(textData) {
  let newTextData = textData["Chapters"]["data"];
  let chapterPath;
  for (let i = 0; i < newTextData.length; ++i) {
    if (newTextData[i]["attributes"]["ChapterNumber"] == null) {
      chapterPath = "./output/chapter-" + (i + 1) + "/";
    } else {
      chapterPath =
        "./output/chapter-" +
        newTextData[i]["attributes"]["ChapterNumber"] +
        "/";
    }
    makeDir(chapterPath);
    let chapterSlug = newTextData[i]["attributes"]["Slug"];

    const res = await fetch(
      "https://itell-strapi-um5h.onrender.com/api/chapters?filters[Slug][$eq]=" +
        chapterSlug +
        "&populate=*",
      { cache: "no-store" },
    );
    let data = await res.json();

    if (data["data"][0]["attributes"]["Pages"]) {
      let chapterData = data["data"][0]["attributes"]["Pages"]["data"];
      await entryPages(chapterData, chapterPath);
    }
  }
}

async function run() {
  let textID = getTextID();
  let textData = await getTextData(textID);

  hasChapters = textData["Chapters"]["data"].length > 0;
  hasModules = textData["Modules"]["data"].length > 0;

  if (!fs.existsSync("./output/")) {
    fs.mkdir("./output/", (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  if (hasModules) {
    await makeModules(textData);
  } else if (hasChapters) {
    await makeChapters(textData);
  } else {
    await entryPages(textData["Pages"]["data"], "output/");
  }
}

run();
