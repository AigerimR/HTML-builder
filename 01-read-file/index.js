const fs = require("fs");
const path = require("path");

console.log(path.join(__dirname, "./text.txt"));
const textStream = fs.createReadStream(
  path.join(__dirname, "./text.txt"),
  "utf-8"
);
let data = "";
textStream.on("data", (chunk) => {
  data += chunk;
});
textStream.on("end", () => console.log(data));
