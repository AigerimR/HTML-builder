const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

const writeTextStream = fs.createWriteStream(
  path.join(__dirname, "newtext.txt")
);
stdout.write("Введите текст\n");
stdin.on("data", (chunk) => {
  if (chunk.toString().includes("exit")) {
    process.exit();
  }
  writeTextStream.write(chunk);
});
process.on("exit", () => stdout.write("Bye bye!\n"));
