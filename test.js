const createOccClient = require("./index.js");

const occClient = createOccClient();

occClient.start("Code.exe", "测试vscode");

setTimeout(() => {
  occClient.stop();
}, 1000 * 10);
