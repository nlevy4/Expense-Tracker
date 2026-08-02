const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

const store = () => getStore("expense-tracker-data");

const readAll = async (name) => {
  const data = await store().get(name, { type: "json" });
  return data || [];
};

const writeAll = async (name, records) => {
  await store().setJSON(name, records);
};

const insert = async (name, record) => {
  const records = await readAll(name);
  const newRecord = {
    _id: crypto.randomUUID(),
    ...record,
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  await writeAll(name, records);
  return newRecord;
};

const removeById = async (name, id) => {
  const records = await readAll(name);
  const filtered = records.filter((record) => record._id !== id);
  await writeAll(name, filtered);
  return filtered.length !== records.length;
};

module.exports = { readAll, writeAll, insert, removeById };
