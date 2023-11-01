const sqliteClient = require("./dataBase");

class Db {
  constructor(dbPath) {
    this.dbLayer = sqliteClient;
    this.dbPath = dbPath;
    this.dbLayer.init(dbPath);
  }

  // step1 写profile数据
  writeProfileDate = (data, onSucc, onFail) => {
    const { id, name, exe_name, start_time } = data;
    console.log("call writeProfileDate", data);

    let insert_sql =
      "INSERT INTO `usage_profile` (`id`,`name`,`exe_name`,`start_time`)VALUES (?, ?, ?, ? );";
    this.dbLayer.db.run(
      insert_sql,
      [id, name, exe_name, start_time],
      (err, rows) => {
        if (err == null) {
          console.log("profile 数据插入成功");
          onSucc && onSucc();
        } else {
          console.log("profile 数据插入失败：", err);
          onFail && onFail(err);
        }
      }
    );
  };

  // step2 写进程信息
  writeProcessData(data, onSucc, onFail) {
    const { pid, command, ppid, args } = data;
    // this.dbLayer.db.each(
    //   `SELECT EXISTS(SELECT 1 FROM pid WHERE pid = ${pid});`,
    //   (err, row) => {
    //     if (err) {
    //       console.log("check exist %s err: %s", pid, err);
    //       return;
    //     }
    //     console.log("%s exist row, err: %s", pid, row, err);
    //   }
    // );

    let insert_sql =
      "INSERT INTO `pid` (`pid`,`command`,`ppid`,`args`)VALUES (?, ?, ?, ? );";
    this.dbLayer.db.run(insert_sql, [pid, command, ppid, args], (err, rows) => {
      if (err == null) {
        // console.log("%s:进程数据插入成功", pid);
        onSucc && onSucc();
      } else {
        // console.log("%s进程数据插入失败：", pid, err);
        onFail && onFail(err);
      }
    });
    // this.dbLayer.run(
    //   `INSERT INTO pid(pid,command,ppid, args) VALUES (${pid},${command},${ppid},${args})`,
    //   onSucc,
    //   onFail
    // );
  }
  // step3 写检测数据
  writeOccupyDate(data, onSucc, onFail) {
    const { profile_id, pid, cpu, memory, timestamp } = data;
    let insert_sql =
      "INSERT INTO occupy (profile_id,pid,cpu,memory,timestamp)VALUES (?, ?, ?, ?, ? );";
    this.dbLayer.db.run(
      insert_sql,
      [profile_id, pid, cpu, memory, timestamp],
      (err, rows) => {
        if (err == null) {
          // console.log("%s:检测数据插入成功", pid);
          onSucc && onSucc();
        } else {
          console.log("%s检测数据插入失败：", pid, err);
          onFail && onFail(err);
        }
      }
    );
  }

  updateProfileData(data) {}
}

module.exports = Db;
