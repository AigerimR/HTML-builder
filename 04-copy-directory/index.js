const { mkdir, copyFile, rm, access } = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

const newFolderDir = path.join(__dirname, "files-copy");
access(newFolderDir, (err) => {
  if (err) {
    copyDir();
  } else {
    rm(newFolderDir, { recursive: true }, (err) => {
      if (err) throw err;
      console.log("Папка была deleted");
      copyDir();
    });
  }
});

async function copyDir() {
  try {
    await mkdir(newFolderDir, { recursive: true, force: true }, (err) => {
      if (err) throw err;
    });
    const files = await readdir(path.join(__dirname, "files"));
    for (const file of files) {
      copyFile(
        path.join(__dirname, "files", file),
        path.join(__dirname, "files-copy", file),
        (err) => {
          if (err) throw err;
        }
      );
    }
    console.log("Файлы скопированы");
  } catch (err) {
    console.error(err);
  }
}
