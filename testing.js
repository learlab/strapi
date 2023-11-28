const fs = require('fs')

async function run() {

  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  let title = process.argv[2];

  if(!fs.existsSync('./output')){
    fs.mkdir('./output', (err) => {
      if (err) {
        console.log(err);
      }
    });
  }



  try {
    const resText = await fetch(`https://itell-strapi-um5h.onrender.com/api/texts`, {cache: "no-store"});
    let dataText = await resText.json();

    let textID = 0;

    for (let i = 0; i < dataText["data"].length; ++i) {
      let curData = dataText["data"][i]["attributes"];
      if (curData["Title"] === title) {
        textID = dataText["data"][i]["id"];
      }
    }

    console.log("textID: " + textID);

    if (textID !== 0) {
      const resModules = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=modules', {cache: "no-store"});
      let dataModules = await resModules.json();

      let curDataModules = dataModules["data"]["attributes"]["modules"]["data"];
      if (curDataModules.length > 0) {
        for (let i = 0; i < curDataModules.length; ++i) {
          let moduleID = curDataModules[i]["id"];

          const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/' + moduleID + '?populate=chapters', {cache: "no-store"});
          let dataChapters = await resChapters.json();

          let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
          if (curDataChapters.length > 0) {
            for (let j = 0; j < curDataChapters.length; ++j) {
              let chapterID = curDataChapters[j]["id"];

              const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/' + chapterID + '?populate=pages', {cache: "no-store"});
              let dataPages = await resPages.json();

              let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
              if (curDataPages.length > 0) {
                for (let k = 0; k < curDataPages.length; ++k) {
                  let pageID = curDataPages[k]["id"];

                  const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
                  let data = await res.json();

                  let curPage = data["data"];

                  let filename = "./output/" + dataChapters["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-');
                  if(!fs.existsSync(filename)){
                    fs.mkdir(filename, (err) => {
                      if (err) {
                        console.log(err);
                      }
                    });
                  }

                  filename += "/" + dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-');
                  if(!fs.existsSync(filename)){
                    fs.mkdir(filename, (err) => {
                      if (err) {
                        console.log(err);
                      }
                    });
                    console.log("success");
                  }

                  filename  += "/" + curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";

                  fs.appendFile(filename, "---", (err) => {
                    if (err)
                      console.log("1" + err);
                  });
                  fs.appendFile(filename, curPage["attributes"]["Title"], (err) => {
                    if (err)
                      console.log("2" + err);
                  });

                  fs.appendFile(filename, "---", (err) => {
                    if (err)
                      console.log("3" + err);
                  });
                  for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                    let curData = curPage["attributes"]["Content"][l];
                    if (curData["__component"] === "page.chunk") {
                      let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                      fs.appendFile(filename, inputString, (err) => {
                        if (err)
                          console.log("3" + err);
                      });
                      fs.appendFile(filename, curData["MDX"], (err) => {
                        if (err)
                          console.log("3" + err);
                      });
                      fs.appendFile(filename, "</div>", (err) => {
                        if (err)
                          console.log("3" + err);
                      });
                    } else if (curData["__component"] === "page.video") {
                    }
                  }
                  console.log(filename);
                }
              }

            }
          }
        }

      } else {
        const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=chapters', {cache: "no-store"});
        let dataChapters = await resChapters.json();

        let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
        if (curDataChapters.length > 0) {
          for (let i = 0; i < curDataModules.length; ++i) {
            let moduleID = curDataModules[i]["id"];

            const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/' + moduleID + '?populate=chapters', {cache: "no-store"});
            let dataChapters = await resChapters.json();

            let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
            if (curDataChapters.length > 0) {
              for (let j = 0; j < curDataChapters.length; ++j) {
                let chapterID = curDataChapters[j]["id"];

                const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/' + chapterID + '?populate=pages', {cache: "no-store"});
                let dataPages = await resPages.json();

                let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
                if (curDataPages.length > 0) {
                  for (let k = 0; k < curDataPages.length; ++k) {
                    let pageID = curDataPages[k]["id"];

                    const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
                    let data = await res.json();

                    let curPage = data["data"];

                    let filename = dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
                      curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";

                    fs.writeFile(filename, "---", (err));
                    fs.appendFile(filename, curData["Title"], (err));
                    fs.appendFile(filename, "---", (err));
                    for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                      let curData = curPage["attributes"]["Content"][l];
                      if (curData["__component"] === "page.chunk") {
                        let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                        fs.appendFile(filename, inputString, (err));
                        fs.appendFile(filename, curData["MDX"], (err));
                        fs.appendFile(filename, "</div>", (err));
                      } else if (curData["__component"] === "page.video") {
                      }
                    }
                    console.log(filename);
                  }
                }

              }
            }
          }

        } else {
          const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=pages', {cache: "no-store"});
          let dataPages = await resPages.json();

          let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
          if (curDataPages.length > 0) {
            for (let k = 0; k < curDataPages.length; ++k) {
              let pageID = curDataPages[k]["id"];

              const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
              let data = await res.json();

              let curPage = data["data"];

              let filename = dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
                curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";

              fs.writeFile(filename, "---", (err));
              fs.appendFile(filename, curData["Title"], (err));
              fs.appendFile(filename, "---", (err));
              for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                let curData = curPage["attributes"]["Content"][l];
                if (curData["__component"] === "page.chunk") {
                  let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                  fs.appendFile(filename, inputString, (err));
                  fs.appendFile(filename, curData["MDX"], (err));
                  fs.appendFile(filename, "</div>", (err));
                } else if (curData["__component"] === "page.video") {
                }
              }
              console.log(filename);
            }
          }

        }
      }
    }


  } catch (err) {
    console.log(err);
  }
}

run();
