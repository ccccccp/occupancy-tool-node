const { USAGE_DATA_TYPES } = require("./const");
const dateFilter = require("./dateFilter");

class OccupancyClient {
  constructor() {
    this.dataStore = null;
    this.usage = null;
    this.id = "";
    this.profileCreated = false;
    this.processDataCreated = false;
  }
  /**
   * 开始检测
   * @param {*} name
   * @param {*} pname
   */
  start(pname, name = "未命名名字") {
    // 创建profile记录
    this.id = this.getId(
      name,
      pname,
      dateFilter(new Date(), "YYYY-MM-DD_HH.ii.ss")
    );
    this.dataStore.writeProfileDate(
      {
        id: this.id,
        name,
        exe_name: pname,
        start_time: +new Date(),
      },
      () => {
        this.profileCreated = true;
      }
    );

    if (!this.usage) {
      throw "usage未初始化";
    }
    this.usage.start(pname, {
      onData: (e) => {
        console.log("on-data:", e.type);
        switch (e.type) {
          case USAGE_DATA_TYPES.startData:
            // 初始化表(pid信息)

            for (let i = 0; i < e.data.length; i++) {
              const pidInfo = e.data[i];
              // pidInfo.arguments && console.log("data-args:", pidInfo.arguments);
              this.writeProcessData({
                pid: parseInt(pidInfo.pid),
                command: pidInfo.command,
                ppid: parseInt(pidInfo.ppid),
                args: JSON.stringify(pidInfo.arguments),
              });
            }
            break;
          case USAGE_DATA_TYPES.lineData:
            // 创建occupy记录
            for (let pid in e.data) {
              const lineData = e.data[pid];
              this.writeoccupyData({
                profile_id: this.id,
                pid: lineData.pid,
                cpu: lineData.cpu,
                memory: lineData.memory,
                timestamp: lineData.timestamp,
              });
            }

            break;
          case USAGE_DATA_TYPES.endData:
            // 更新结束时间
            break;
        }
      },
    });
  }

  getId(name, pname, time) {
    const arr = [];
    if (name) {
      arr.push(name);
    }
    if (pname) {
      arr.push(pname);
    }
    if (time) {
      arr.push(time);
    }
    return arr.join("_");
  }

  /**
   * 停止检测
   */
  stop() {
    this.usage.stop();
  }

  /**
   * 写数据
   * @param {*} data
   */
  writeoccupyData(data) {
    this.dataStore.writeOccupyDate(data);
  }

  writeProcessData(data) {
    // 创建pid记录
    this.dataStore.writeProcessData(data);
  }

  /**
   * 设置store
   * @param {*} dataStore
   */
  setDateStore(dataStore) {
    this.dataStore = dataStore;
  }

  /**
   * 设置检测client
   * @param {*} usageClient
   */
  setUsage(usageClient) {
    this.usage = usageClient;
  }
}

module.exports = OccupancyClient;
