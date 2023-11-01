## 性能检测工具-node 检测部分

### 安装

`npm install occupancy-tool-node`

### 示例代码

```js
const path = require("path");
const { createOccClient, USAGE_DATA_TYPES } = require("occupancy-tool-node");

const occClient = createOccClient(path.join(__dirname, "1111.db"), 3000);

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
```
