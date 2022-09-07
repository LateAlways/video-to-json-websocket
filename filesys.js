var fs = require('fs');

function appendfile(path, content) {
    fs.appendFile(path, content, function () {});
}

function writefile(path, content) {
    fs.writeFile(path, content, function() {});
}

function delfile(path) {
    fs.unlink(path, function () {});
}

function rename(from, to) {
    fs.rename(from, to, function () {});
}

function readfile(path) {
    fs.readFileSync(path, 'utf8');
    return fs.readFileSync(path, 'utf8');
}

function exists(path) {
    return fs.existsSync(path)
}

function makefolder(path) {
    fs.mkdir(path,function(e){});
}

module.exports = {
    appendfile,
    writefile,
    delfile,
    rename,
    readfile,
    exists,
    makefolder
}
