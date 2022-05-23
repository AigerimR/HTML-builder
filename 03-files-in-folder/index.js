const { readdir } = require("fs/promises");
const { stat } = require("fs/promises");
const path = require("path");

(async () => {
  try {
    const allfiles = await readdir(path.join(__dirname, "secret-folder"), {
      withFileTypes: true,
    });
    let files = [];
    for (const file of allfiles) {
      if (file.isFile() === true) {
        files.push(path.parse(file.name));
      }
    }

    for (const file of files) {
      let fileData = await stat(
        path.join(__dirname, "secret-folder", file.base)
      );
      outString = `${file.name} - ${file.ext.slice(1)} - ${
        fileData.size / 1000
      }kb`;
      console.log(outString);
    }
  } catch (err) {
    console.error(err);
  }
})();
