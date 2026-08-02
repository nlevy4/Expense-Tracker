const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getStore } = require("@netlify/blobs");

// SITE_ID is only auto-injected inside Netlify's runtime (netlify dev or a
// deployed function) — plain `node server.js` never has it. Use that as the
// signal for which storage backend to use, so local dev keeps working off
// plain JSON files while Netlify uses Blobs.
const usingBlobs = !!process.env.SITE_ID;

const DATA_DIR = path.join(__dirname, "..", "data");
const filePath = (name) => path.join(DATA_DIR, `${name}.json`);

// Automatic environment detection for Netlify Blobs doesn't reliably reach
// through the Express + serverless-http wrapper, so fall back to explicit
// credentials when available. The token comes from a personal access token
// set as an env var.
const store = () => {
  const siteID = process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;

  if (siteID && token) {
    return getStore({ name: "expense-tracker-data", siteID, token });
  }

  return getStore("expense-tracker-data");
};

const readAll = async (name) => {
  if (!usingBlobs) {
    if (!fs.existsSync(filePath(name))) return [];
    return JSON.parse(fs.readFileSync(filePath(name), "utf-8"));
  }

  const data = await store().get(name, { type: "json" });
  return data || [];
};

const writeAll = async (name, records) => {
  if (!usingBlobs) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(filePath(name), JSON.stringify(records, null, 2));
    return;
  }

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
