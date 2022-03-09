import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
const ipfsClient = require('ipfs-http-client')
const express = require("express");
const app = express();
const multer = require("multer");
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});
app.use(express.json());

const auth =
  'Basic ' + Buffer.from(process.env.PROJECT_ID.toString() + ':' + process.env.PROJECT_SECRET.toString()).toString('base64');

const algorithm = 'aes-256-ctr';
const key = Buffer.from(scryptSync(process.env.ENCRYPTION_KEY.toString(), 'salt', 32))
const iv = Buffer.from(process.env.ENCRYPTION_IV.toString());

function encrypt(input) {

  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
  return encrypted.toString('hex');
}

function decrypt(input) {
  const decipher = createDecipheriv(algorithm, key, iv);
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(input, 'hex')),
    decipher.final(),
  ]);
  return decrpyted.toString();
}

function fileToDataUrl(file) {
  if (file && file.buffer && file.mimetype) {
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
  }
}

async function uploadToIPFS(string) {
  const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: auth,
    },
  });
  return await client.add(string)
}

app.post('/upload', upload.single("file"), async (req, res) => {
  try {
    const encrypted = encrypt(fileToDataUrl(req.file))
    const uploaded = await uploadToIPFS(encrypted)
    res.send(uploaded.cid.toString())
  } catch (error) {
    console.error("Error encrypt", error)
    throw error
  }
})

app.post('/get', upload.single("data"), async (req, res) => {
  try {
    const cid = req.body.data
    const client = ipfsClient.create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth,
      },
    });
    const chunks = [];
    for await (const chunk of client.cat(cid)) {
      chunks.push(chunk);
    }
    // Convert Uint8Array to base64 string
    let chunkStringBase64 = "";
    chunks.forEach((chunk) => {
      chunkStringBase64 += new TextDecoder().decode(chunk);
    });
    const decrypted = decrypt(chunkStringBase64)
    res.send(decrypted)
  } catch (error) {
    console.error("Error decrypt", error)
    throw error
  }
})

module.exports = {
  path: '/storage',
  handler: app
}