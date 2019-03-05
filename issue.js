#!/usr/bin/env node

const request = require('request');
const fs = require('fs');
var Git = require("nodegit");
const dotenv = require('dotenv');

function callback(error, response, body) {
    // 201: created
    if (!error && response.statusCode == 201) {
        console.log("body:");
        console.log(body);

    }
}

// setup environment
dotenv.config();

// list of issue
let issueList = JSON.parse(fs.readFileSync('./api/issues-html5.json', 'utf8'));

let username = process.env.USERNAME;
let token = process.env.API_TOKEN;
let auth = "Basic " + new Buffer(username + ":" + token).toString("base64");
var url = "https://api.github.com/repos/marconicivitavecchia-projectx/prof/issues";
let options = {
    url: url,
    headers: {
        'User-Agent': 'request',
        "Authorization" : auth
    },
    method: 'POST',
    json: issueList
};

request(options, callback);

