const pidusage = require("pidusage");
const processlist = require("node-processlist");
const commandGetter = require("./commandGetter");
const { USAGE_DATA_TYPES } = require("./const");

function sendData(data) {
  process.send({ type: "process-data", data });
}

const CpuUsage = (() => {
  let timer = null;
  let started = false;
  let usageing = false;

  async function run(checkProcessName, onData) {
    const allProcessList = await processlist.getProcesses();
    const targetProcessList = allProcessList.filter(
      (p) => p.name == checkProcessName
    );
    if (targetProcessList.length == 0) {
      return;
    }
    // console.log("targetProcessList:", targetProcessList);
    const pidList = targetProcessList.map((p) => p.pid);
    if (usageing) {
      return;
    }
    usageing = true;
    pidusage(pidList, (err, stats) => {
      usageing = false;
      // console.log("stats:", stats);
      // if (err || !started) return;
      onData &&
        onData({
          type: USAGE_DATA_TYPES.lineData,
          data: stats,
        });
    });
  }

  return {
    async start(checkProcessName, onData, timeout = 2000) {
      if (started) {
        console.log("已经开始了");
        throw "已经开始了";
      }
      started = true;
      const pidInfoList = await commandGetter.init();

      onData &&
        onData({
          type: USAGE_DATA_TYPES.startData,
          data: pidInfoList,
        });

      timer = setInterval(() => {
        run(checkProcessName, onData);
      }, timeout);
    },
    stop() {
      started = false;
      clearInterval(timer);
    },
  };
})();

process.on("message", function (message) {
  if (message) {
    // console.log("child process on message:", message);
    if (!message.type) {
      return;
    }
    const { type, data } = message;
    switch (type) {
      case "startUsage":
        const { process_name, timeout } = data;
        CpuUsage.start(
          process_name,
          (data) => {
            // console.log("send data:", data);
            sendData(data);
          },
          timeout
        );
      case "stopUsage":
        CpuUsage.stop();
        break;
    }
  }
});
process.send({ type: "process-loaded", data: "子线程已经开启,等待处理..." });
