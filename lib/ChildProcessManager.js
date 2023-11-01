const { fork } = require("node:child_process");
const _ = require("lodash");

class ChildProcessManager {
  constructor(childPath, callbacks) {
    this.callbacks = callbacks;
    //参数一表示，运行的模块
    //参数二表示，参数列表
    //参数三表示，创建子进程的配置
    this.child_process = fork(childPath, [], {
      //子进程的工作目录
      cwd: process.cwd(),
      //子进程的环境变量
      env: process.env,
      //运行模块的可执行文件
      execPath: process.execPath,
      //传递给可执行文件的参数列表
      execArgv: process.execArgv,
      //为false表示父进程与子进程共享标准(输入/输出)，为true时不共享。
      silent: false,
    });
    // console.log(this.child_process);
    this.child_process.on("message", this.onChildProcessMessage);
    this.child_process.on("error", this.onChildProcessError);
    this.child_process.on("exit", this.onChildProcessExit);
  }

  onChildProcessExit = (e) => {
    console.log("child process on exit:", e);
    this.child_process = null;
    _.invoke(this.callbacks, "onExit");
  };

  onChildProcessMessage = (e) => {
    // console.log("on child_process message");
    if (!e.type) {
      return;
    }
    switch (e.type) {
      case "process-loaded":
        _.invoke(this.callbacks, "onLoaded");
        break;
      case "process-data":
        _.invoke(this.callbacks, "onData", e.data);
        break;
      default:
        break;
    }
  };

  onChildProcessError = (err) => {
    console.log("child process on error", err);
  };

  send(args) {
    this.child_process.send(args);
  }

  kill(args) {
    this.child_process.kill(args);
  }
}

module.exports = ChildProcessManager;
