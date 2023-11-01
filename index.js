const OccupancyClient = require("./lib/OccupancyClient");
const Usage = require("./lib/Usage");
const DataStore = require("./lib/dataStore");
const path = require("path");

function createOccClient(dbPath) {
  const occClient = new OccupancyClient();
  const _dbPath = dbPath || path.resolve(__dirname, "oc-node-database.db");
  const dataStore = new DataStore(_dbPath);
  const usage = new Usage();
  occClient.setDateStore(dataStore);
  occClient.setUsage(usage);
  return occClient;
}

module.exports = createOccClient;
