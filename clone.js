#!/usr/bin/env node

const request = require('request');
var Git = require("nodegit");

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        info.forEach(repo => {
            console.log(repo.html_url);
            Git.Clone(repo.html_url,`${organization}/${repo.name}`);
        });

    }
}

var organization = process.argv[2];
if (typeof organization != "undefined") {
    let options = {
        url: `https://api.github.com/users/${organization}/repos`,
        headers: {
            'User-Agent': 'request'
        }
    };    
    request(options, callback);
} else {
    console.log("Please insert the organization name");
}

