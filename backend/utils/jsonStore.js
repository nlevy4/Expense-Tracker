const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

// Automatic environment detection for Netlify Blobs doesn't reliably reach
// through the Express + serverless-http wrapper, so fall back to explicit
// credentials when available. SITE_ID is auto-injected by Netlify; the
// token comes from a personal access token set as an env var.
const store = () => {
  const siteID = process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name: "expense-tracker-data", siteID, token });
  }

  return getStore("expense-tracker-data");
};

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
