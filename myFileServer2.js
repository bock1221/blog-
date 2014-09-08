/*jslint plusplus: true, unparam: true */
"use strict";

var path = require('path'),
    fs = require('fs'),
    mimeTypes = {
        '.js' : 'text/javascript',
        '.html': 'text/html',
        '.css' : 'text/css'
    };
    
module.exports = function (req, res, next) {
    var lookup = path.basename(decodeURI(req.url)),
        file = 'content/' + lookup;

    fs.exists(file, function (exists) {
        if (exists) {
            fs.readFile(file, function (err, data) {
                if (!err) {
                    var headers = {'Content-type': mimeTypes[path.extname(lookup)]};
                    res.writeHead(200, headers);
                    res.end(data);
                } else {
                    next(err);
                }
            });
        } else {
            next();
        }
    });
}
