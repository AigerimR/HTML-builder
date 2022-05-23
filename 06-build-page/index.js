const {
  mkdir,
  copyFile,
  readFile,
  writeFile,
  appendFile,
  rm,
  access,
} = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");
const { dirname } = require("path");

//create project-dist and assets folders
const newProjectDir = path.join(__dirname, "project-dist");
const newAssetsDir = path.join(newProjectDir, "assets");

mkdir(newProjectDir, { recursive: true }, (err) => {
  if (err) throw err;
  console.log("project-dist is created");
  mkdir(newAssetsDir, { recursive: true }, (err) => {
    if (err) throw err;
    console.log("assets folder is copied");
  });
});

// copy ASSETS' folders into it
const newAssetsFontsDir = path.join(newAssetsDir, "fonts");
const oldAssetsFontsDir = path.join(__dirname, "assets", "fonts");
const newAssetsImgDir = path.join(newAssetsDir, "img");
const oldAssetsImgDir = path.join(__dirname, "assets", "img");
const newAssetsSvgDir = path.join(newAssetsDir, "svg");
const oldAssetsSvgDir = path.join(__dirname, "assets", "svg");

copyMyFiles(newAssetsFontsDir, oldAssetsFontsDir);
copyMyFiles(newAssetsImgDir, oldAssetsImgDir);
copyMyFiles(newAssetsSvgDir, oldAssetsSvgDir);

function copyMyFiles(newDir, oldDir) {
  access(newDir, (err) => {
    if (err) {
      copyDir(newDir, oldDir);
    } else {
      rm(newDir, { recursive: true }, (err) => {
        if (err) throw err;
        copyDir(newDir, oldDir);
      });
    }
  });
}

async function copyDir(newDir, oldDir) {
  try {
    await mkdir(newDir, { recursive: true, force: true }, (err) => {
      if (err) throw err;
    });
    const files = await readdir(oldDir);
    for (const file of files) {
      copyFile(path.join(oldDir, file), path.join(newDir, file), (err) => {
        if (err) throw err;
      });
    }
  } catch (err) {
    console.error(err);
  }
}

//STYLE.CSS bundling
const oldStylesDir = path.join(__dirname, "styles");
const newStylesFileDir = path.join(newProjectDir, "style.css");

let cssFiles = [];

//read css files
(async () => {
  try {
    const allStyle = await readdir(oldStylesDir, {
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

//check if style.css file exists and delete if needed
access(newStylesFileDir, (err) => {
  if (err) {
    createBundle();
  } else {
    rm(newStylesFileDir, { recursive: true }, (err) => {
      if (err) throw err;
      createBundle();
    });
  }
});

//create bundle file
async function createBundle() {
  writeFile(newStylesFileDir, "", (err) => {
    if (err) throw err;
    console.log("style.css is created");
  });
  // console.log(cssFiles);
  for (const file of cssFiles) {
    let pathToFile = path.join(oldStylesDir, file);
    readFile(pathToFile, "utf-8", (err, data) => {
      if (err) throw err;
      appendFile(newStylesFileDir, `${data} \n`, (err) => {
        if (err) throw err;
        // console.log("Файл был изменен");
      });
    });
  }
}

//INDEX.html
//check if index.html file exists and delete if needed
const newIndexFileDir = path.join(newProjectDir, "index.html");
const oldIndexFileDir = path.join(__dirname, "template.html");

access(newIndexFileDir, (err) => {
  if (err) {
    createIndexFile();
  } else {
    rm(newIndexFileDir, { recursive: true }, (err) => {
      if (err) throw err;
      createIndexFile();
    });
  }
});

function createIndexFile() {
  writeFile(newIndexFileDir, "", (err) => {
    if (err) throw err;
    replaceComponents();
    console.log("index.html is created");
  });
}

//create variables for components' data
const componentsDir = path.join(__dirname, "components");
let htmlFiles = [];

(async () => {
  try {
    const allComponents = await readdir(componentsDir, {
      withFileTypes: true,
    });
    let allComponentsFiles = [];
    for (const file of allComponents) {
      if (file.isFile() === true) {
        allComponentsFiles.push(path.parse(file.name));
      }
    }
    for (const file of allComponentsFiles) {
      if (file.ext === ".html") {
        htmlFiles.push(file.base);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();

async function replaceComponents() {
  try {
    let htmlInitial = "";
    readFile(oldIndexFileDir, "utf-8", (err, data) => {
      if (err) throw err;
      htmlInitial = data;
    });
    for (const file of htmlFiles) {
      let name = file.split(".")[0];
      await readFile(path.join(componentsDir, file), "utf-8", (err, data) => {
        if (err) throw err;
        let replacingData = htmlInitial.replace(`{{${name}}}`, data);
        htmlInitial = replacingData;
        writeFile(newIndexFileDir, replacingData, "utf8", function (err) {
          if (err) return console.log(err);
        });
      });
    }
  } catch (err) {
    console.error(err);
  }
}
