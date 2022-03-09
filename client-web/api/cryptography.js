import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import fs from 'fs';
const ipfsClient = require('ipfs-http-client')

//const bodyParser = require('body-parser')
const express = require("express");
var bodyParser = require('body-parser')
const app = express();
app.use(express.json());
const multer = require("multer");
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 }
});
const https = require('https');

const projectId = "25pSJkP92Q52fozRftdh9eA7Y6f";
const projectSecret = "d8010b44bf9f8a13028b4031580b416c";
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


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

// Defining algorithm
const algorithm = 'aes-256-ctr';

// Defining key
const key = Buffer.from(scryptSync("jmWq!l@lj$WbXLVn&0cB!6Ck4INe$#Iy", 'salt', 32))

// Defining iv
const iv = Buffer.from("kt%3E@gg2c01P9ut")

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

app.post('/encrypt', upload.single("file"), async (req, res) => {
  try {
    const encrypted = encrypt(fileToDataUrl(req.file))
    const uploaded = await uploadToIPFS(encrypted)
    res.send(uploaded.cid.toString())
  } catch (error) {
    console.error("Error encrypt", error)
    throw error
  }
})

// app.use(bodyParser.json({ limit: "50mb" }))
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.post('/decrypt', upload.single("data"), (req, res) => {
  try {
    // res.send("cenas")
    const decrypted = decrypt(req.body.data)
    res.send(decrypted)
  } catch (error) {
    console.error("Error decrypt", error)
    throw error
  }
})

module.exports = {
  path: '/cryptography',
  handler: app
}