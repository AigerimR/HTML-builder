const path = require("path");
const { readdir } = require("fs/promises");
const { readFile, writeFile, appendFile, access, rm } = require("fs");

const stylesDir = path.join(__dirname, "styles");
const bundleFileDir = path.join(__dirname, "project-dist", "bundle.css");

let cssFiles = [];

//read css files
(async () => {
  try {
    const allStyle = await readdir(stylesDir, {
      withFileTypes: true,
    });
    let allStyleFiles = [];
    for (const file of allStyle) {
      if (file.isFile() === true) {
        allStyleFiles.push(path.parse(file.name));
      }
    }
    for (const file of allStyleFiles) {
      if (file.ext === ".css") {
        cssFiles.push(file.base);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

//check if file exist and delete if needed
access(bundleFileDir, (err) => {
  if (err) {
    createBundle();
  } else {
    rm(bundleFileDir, { recursive: true }, (err) => {
      if (err) throw err;
      createBundle();
    });
  }
});

//create bundle file
async function createBundle() {
  writeFile(bundleFileDir, "", (err) => {
    if (err) throw err;
    console.log("Файл bundle.css создан");
  });
  // console.log(cssFiles);
  for (const file of cssFiles) {
    let pathToFile = path.join(__dirname, "styles", file);
    readFile(pathToFile, "utf-8", (err, data) => {
      if (err) throw err;
      appendFile(bundleFileDir, `${data} \n`, (err) => {
        if (err) throw err;
        console.log("Файл был изменен");
      });
    });
  }
}
