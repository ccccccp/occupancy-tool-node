const OccupancyClient = require("./lib/OccupancyClient");
const Usage = require("./lib/Usage");
const { USAGE_DATA_TYPES } = require("./lib/const");
const DataStore = require("./lib/dataStore");
const path = require("path");

function createOccClient(dbPath, usageTimeout = 2000) {
  const occClient = new OccupancyClient();
  const _dbPath = dbPath || path.resolve(__dirname, "oc-node-database.db");
  const dataStore = new DataStore(_dbPath);
  const usage = new Usage(usageTimeout);
  occClient.setDateStore(dataStore);
  occClient.setUsage(usage);
  return occClient;
}

module.exports = {
  createOccClient,
  USAGE_DATA_TYPES,
};
