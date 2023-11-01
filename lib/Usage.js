const path = require("path");
const _ = require("lodash");
const ChildProcessManager = require("./ChildProcessManager");

class Usage {
  constructor(usageTime = 2000) {
    this.child_process = null;
    this.name = "";
    this.usageTime = usageTime;
  }

  /**
   * @param {String} process_name
   * @param {*} options onData
   */
  start(process_name, options) {
    if (this.usageChildProcess) {
      console.error("子进程正在运行中");
      return;
    }
    const timeout = this.usageTime;
    const childPath = path.join(__dirname, "child_usage.js");
    this.usageChildProcess = new ChildProcessManager(childPath, {
      onLoaded: () => {
        this.usageChildProcess.send({
          type: "startUsage",
          data: {
            process_name,
            timeout: timeout,
          },
        });
      },
      onExit: () => {
        this.usageChildProcess = null;
      },
      onData: (e) => {
        console.log("on usage cp data");
        options.onData && options.onData(e);
      },
    });
  }

  stop() {
    if (this.usageChildProcess) {
      this.usageChildProcess.kill(2);
    }
  }
}

module.exports = Usage;
