const path = require("path");
const { createOccClient, USAGE_DATA_TYPES } = require("../index.js");

const occClient = createOccClient(
  path.join(__dirname, "../dbs", "1111.db"),
  3000
);

occClient.start("Code.exe", "测试vscode");
occClient.on(USAGE_DATA_TYPES.startData, (data) => {
  console.log("on start data:", data);
});

occClient.on(USAGE_DATA_TYPES.lineData, (data) => {
  console.log("on line data:", Object.keys(data));
});
setTimeout(() => {
  occClient.stop();
}, 1000 * 30);
