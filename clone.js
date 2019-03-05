#!/usr/bin/env node

const request = require('request');
var Git = require("nodegit");
var fs = require('fs');

var cloneOptions = {};
cloneOptions.fetchOpts = {
    callbacks: {
        certificateCheck: function () { return 1; }
    }
};


var errorAndAttemptOpen = function () {
    console.log(localPath);
    return Git.Repository.open(localPath);
};


function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        const info = JSON.parse(body);
        info.forEach(repo => {
            //console.log(repo.html_url);
            var localPath = require("path").join(__dirname, "tmp");
            var localPath = `${organization}/${repo.name}`;
            // try to clone
            Git.Clone.clone(repo.html_url, localPath, cloneOptions);
            // open and fetch all
            Git.Repository.open(localPath).then(function (repository) {
                return repository.fetchAll().done(function() {
                    console.log("Done!");
                });
            });

        });
        //save json
        repoList = info.map((repo) => {
            return { html_url: repo.html_url, name: repo.name };
        });

        let filename = "org-list.json";
        fs.writeFile(`${filename}`, JSON.stringify(repoList, null, 2), 'utf8', function (err) {
            if (err) throw err;
            console.log(`Saved ${filename}!`);
        });
    } else {
        throw error;
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


