const fs = require("fs");

let db = null;

function createTables(db) {
  // profile表
  db.run(
    "CREATE TABLE if not exists usage_profile (\
      id TEXT PRIMARY KEY, \
      name TEXT, \
      exe_name TEXT, \
      start_time INTEGER, \
      end_time INTEGER\
      );"
  );
  // pid表
  db.run(
    "CREATE TABLE if not exists pid (\
      pid INTEGER PRIMARY KEY NOT NULL,\
      command TEXT, \
      ppid INTEGER, \
      args TEXT\
      );"
  );
  // occupy表
  db.run(
    "CREATE TABLE if not exists occupy (\
      id INTEGER PRIMARY KEY AUTOINCREMENT,\
      profile_id TEXT REFERENCES usage_profile (id),\
      pid INTEGER REFERENCES pid(pid), \
      cpu REAL, \
      memory INTEGER, \
      timestamp INTEGER,\
      FOREIGN KEY (profile_id) REFERENCES usage_profile(id) \
      FOREIGN KEY (pid) REFERENCES pid(pid)\
      );"
  );
}

function init(dbPath) {
  if (db) {
    console.error("db was inited");
    return;
  }

  const sqlite3 = require("sqlite3").verbose();

  db = new sqlite3.Database(dbPath);
  db.serialize(() => {
    // 创建表
    createTables(db);
  });

  return db;
}
function run(cmd, callback, errCb) {
  if (!db) {
    console.error("db was not inited");
    return;
  }
  db.serialize(() => {
    db.run(cmd, callback);
  });
}

function close() {
  db && db.close();
}
module.exports = {
  venders: "sqlite3",
  init: init,
  run: run,
  close: close,
  get db() {
    return db;
  },
};
