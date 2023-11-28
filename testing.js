// const fs = require('fs')
//
// run();
//
// async function run() {
//
//   if (process.argv.length === 2) {
//     console.error('Expected at least one argument!');
//     process.exit(1);
//   }
//
//   let title = process.argv[3];
//
//   makeOutput();
//
//   let textID = getTextID;
//
//   if(textID == 0){
//     return;
//   }
//
//   const textData = getTextData(textID);
//
//
//
//
//
//
//
//       const resModules = await fetch('https://itell-strapi-um5h.onrender.com/api/text/' + textID + '?populate=modules', {cache: "no-store"});
//       let dataModules = await resModules.json();
//
//       let curDataModules = dataModules["data"]["attributes"]["modules"]["data"];
//       if (curDataModules.length > 0) {
//         for (let i = 0; i < curDataModules.length; ++i) {
//           let moduleID = curDataModules[i]["id"];
//
//           const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/' + moduleID + '?populate=chapters', {cache: "no-store"});
//           let dataChapters = await resChapters.json();
//
//           let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
//           if (curDataChapters.length > 0) {
//             for (let j = 0; j < curDataChapters.length; ++j) {
//               let chapterID = curDataChapters[j]["id"];
//
//               const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/' + chapterID + '?populate=pages', {cache: "no-store"});
//               let dataPages = await resPages.json();
//
//               let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
//               if (curDataPages.length > 0) {
//                 for (let k = 0; k < curDataPages.length; ++k) {
//                   let pageID = curDataPages[k]["id"];
//
//                   const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
//                   let data = await res.json();
//
//                   let curPage = data["data"];
//
//                   let filename = dataChapters["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
//                     dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
//                     curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";
//
//                   fs.writeFile(filename, "---", (err));
//                   fs.writeFile(filename, curData["Title"], (err));
//                   fs.writeFile(filename, "---", (err));
//                   for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
//                     let curData = curPage["attributes"]["Content"][l];
//                     if (curData["__component"] === "page.chunk") {
//                       let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
//                       fs.writeFile(filename, inputString, (err));
//                       fs.writeFile(filename, curData["MDX"], (err));
//                       fs.writeFile(filename, "</div>", (err));
//                     } else if (curData["__component"] === "page.video") {
//                     }
//                   }
//                 }
//               }
//
//             }
//           }
//         }
//
//       } else {
//         const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=chapters', {cache: "no-store"});
//         let dataChapters = await resChapters.json();
//
//         let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
//         if (curDataChapters.length > 0) {
//           for (let i = 0; i < curDataModules.length; ++i) {
//             let moduleID = curDataModules[i]["id"];
//
//             const resChapters = await fetch('https://itell-strapi-um5h.onrender.com/api/modules/' + moduleID + '?populate=chapters', {cache: "no-store"});
//             let dataChapters = await resChapters.json();
//
//             let curDataChapters = dataChapters["data"]["attributes"]["chapters"]["data"];
//             if (curDataChapters.length > 0) {
//               for (let j = 0; j < curDataChapters.length; ++j) {
//                 let chapterID = curDataChapters[j]["id"];
//
//                 const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/chapters/' + chapterID + '?populate=pages', {cache: "no-store"});
//                 let dataPages = await resPages.json();
//
//                 let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
//                 if (curDataPages.length > 0) {
//                   for (let k = 0; k < curDataPages.length; ++k) {
//                     let pageID = curDataPages[k]["id"];
//
//                     const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
//                     let data = await res.json();
//
//                     let curPage = data["data"];
//
//                     let filename = dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
//                       curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";
//
//                     fs.writeFile(filename, "---", (err));
//                     fs.writeFile(filename, curData["Title"], (err));
//                     fs.writeFile(filename, "---", (err));
//                     for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
//                       let curData = curPage["attributes"]["Content"][l];
//                       if (curData["__component"] === "page.chunk") {
//                         let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
//                         fs.writeFile(filename, inputString, (err));
//                         fs.writeFile(filename, curData["MDX"], (err));
//                         fs.writeFile(filename, "</div>", (err));
//                       } else if (curData["__component"] === "page.video") {
//                       }
//                     }
//                   }
//                 }
//
//               }
//             }
//           }
//
//         } else {
//           const resPages = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=pages', {cache: "no-store"});
//           let dataPages = await resPages.json();
//
//           let curDataPages = dataPages["data"]["attributes"]["pages"]["data"];
//           if (curDataPages.length > 0) {
//             for (let k = 0; k < curDataPages.length; ++k) {
//               let pageID = curDataPages[k]["id"];
//
//               const res = await fetch('https://itell-strapi-um5h.onrender.com/api/pages/' + pageID + '?populate=Content', {cache: "no-store"});
//               let data = await res.json();
//
//               let curPage = data["data"];
//
//               let filename = dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
//                 curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";
//
//               fs.writeFile(filename, "---", (err));
//               fs.writeFile(filename, curData["Title"], (err));
//               fs.writeFile(filename, "---", (err));
//               for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
//                 let curData = curPage["attributes"]["Content"][l];
//                 if (curData["__component"] === "page.chunk") {
//                   let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
//                   fs.writeFile(filename, inputString, (err));
//                   fs.writeFile(filename, curData["MDX"], (err));
//                   fs.writeFile(filename, "</div>", (err));
//                 } else if (curData["__component"] === "page.video") {
//                 }
//               }
//             }
//           }
//
//         }
//       }
//
// }
//
//
// function makeOutput() {
//   if (!fs.existsSync('./output')) {
//     fs.mkdir('./output', (err) => {
//       if (err) {
//         console.log(err);
//       }
//     });
//
//   }
//
//   async function getTextID() {
//     try {
//       const resText = await fetch(`https://itell-strapi-um5h.onrender.com/api/texts`, {cache: "no-store"});
//       let dataText = await resText.json();
//
//       let textID = 0;
//
//       for (let i = 0; i < dataText["data"].length; ++i) {
//         let curData = dataText["data"][i]["attributes"];
//         if (curData["Title"] === title) {
//           textID = dataText["data"][i]["id"];
//         }
//       }
//
//       return textID;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }
//
// async function getTextData(textID){
//   try{
//     const resModules = await fetch('https://itell-strapi-um5h.onrender.com/api/texts/' + textID + '?populate=*', {cache: "no-store"});
//     let dataModules = await resModules.json();
//
//     return dataModules["data"]["attributes"];
//   }
//   catch (err) {
//     console.log(err);
//   }
// }
//
//
//

const fs = require('fs')

async function run() {

  if (process.argv.length === 2) {
    console.error('Expected at least one argument!');
    process.exit(1);
  }

  let title = process.argv[3];

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

                  let filename = dataChapters["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
                    dataPages["data"]["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + "/" +
                    curPage["attributes"]["Title"].toLowerCase().replace(/\s/g, '-') + ".mdx";

                  fs.writeFile(filename, "---", (err));
                  fs.writeFile(filename, curData["Title"], (err));
                  fs.writeFile(filename, "---", (err));
                  for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                    let curData = curPage["attributes"]["Content"][l];
                    if (curData["__component"] === "page.chunk") {
                      let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                      fs.writeFile(filename, inputString, (err));
                      fs.writeFile(filename, curData["MDX"], (err));
                      fs.writeFile(filename, "</div>", (err));
                    } else if (curData["__component"] === "page.video") {
                    }
                  }
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
                    fs.writeFile(filename, curData["Title"], (err));
                    fs.writeFile(filename, "---", (err));
                    for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                      let curData = curPage["attributes"]["Content"][l];
                      if (curData["__component"] === "page.chunk") {
                        let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                        fs.writeFile(filename, inputString, (err));
                        fs.writeFile(filename, curData["MDX"], (err));
                        fs.writeFile(filename, "</div>", (err));
                      } else if (curData["__component"] === "page.video") {
                      }
                    }
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
              fs.writeFile(filename, curData["Title"], (err));
              fs.writeFile(filename, "---", (err));
              for (let l = 0; l < curPage["attributes"]["Content"].length; ++l) {
                let curData = curPage["attributes"]["Content"][l];
                if (curData["__component"] === "page.chunk") {
                  let inputString = "<div className=\"content-chunk\" data-subsection-id = \"" + curData["Header"] + "\">";
                  fs.writeFile(filename, inputString, (err));
                  fs.writeFile(filename, curData["MDX"], (err));
                  fs.writeFile(filename, "</div>", (err));
                } else if (curData["__component"] === "page.video") {
                }
              }
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
