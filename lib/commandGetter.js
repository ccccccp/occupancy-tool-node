const ps = require("ps-node");

const commandGetter = (() => {
  let commandMap = {};
  let refreshing = false;

  function getData(onSuccess, onError) {
    if (refreshing) {
      return;
    }
    console.time("ps-node");
    refreshing = true;
    ps.lookup({}, function (err, processes) {
      console.timeEnd("ps-node");
      refreshing = false;
      if (err) {
        throw new Error(err);
      }

      // 遍历所有进程信息
      processes.forEach(function (process) {
        commandMap[process.pid] = process;
      });

      onSuccess && onSuccess(processes);
    });
  }
  return {
    init: () => {
      return new Promise((resolve, reject) => {
        getData(resolve, reject);
      });
    },
    getArgs(pid) {
      const process = commandMap[pid];
      if (!process || !process.arguments) return "";
      return Array.from(process.arguments).join(" ");
    },
    getCommand(pid) {
      const process = commandMap[pid];
      if (!process || !process.command) return "";
      return process.command;
    },
    refresh() {
      return new Promise((resolve, reject) => {
        getData(resolve, reject);
      });
    },
  };
})();

module.exports = commandGetter;
