'use strict'

const ytdl = require('ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const filesys = require("./filesys");
const Jimp = require('jimp');
const fs = require("fs");
const WebSocket = require('ws');

if (!filesys.exists("./request")) {
    filesys.makefolder("./request")
}

if (!filesys.exists("./saves")) {
    filesys.makefolder("./saves")
}

const server = new WebSocket.Server({
    port: process.env.PORT || 4000
});

let sockets = [];
server.on('connection', async function(socket) {
    sockets.push(socket);
    console.log("New Connection")
        // When you receive a message, send that message to every socket.
    socket.on('message', function(msg) {
        const {
            action,
            video,
            frame
        } = JSON.parse(((Buffer.from(msg, 'base64')).toString("utf-8")));
        const url = video;
        console.log("Request: " + action + ", " + video + ", " + frame)
        if (filesys.exists("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv")) {
            if (!filesys.exists("./saves/" + url.replace("https://www.youtube.com/watch?v=", "") + "/")) {
                filesys.makefolder("./saves/" + url.replace("https://www.youtube.com/watch?v=", "") + "/");
            }

            ffmpeg("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv")
                .on("end", () => {
                    console.log("Done");
                    Jimp.read('./saves/' + url.replace("https://www.youtube.com/watch?v=", "") + "/" + url.replace("https://www.youtube.com/watch?v=", "") + frame.toString() + '.png')
                        .then(image => {
                            var width = image.bitmap.width;
                            var height = image.bitmap.height;
                            var pixels = [];
                            for (var y = 0; y < height; y++) {
                                var rowPixels = [];
                                for (var x = 0; x < width; x++) {
                                    var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
                                    rowPixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}`);
                                }
                                pixels.push(rowPixels);
                            }
                            socket.send(JSON.stringify({
                                data: pixels
                            }))
                        });
                })
                .seek(frame / 1000)
                .outputOptions(["-vframes", 1, "-q:v", 2])
                .output('./saves/' + url.replace("https://www.youtube.com/watch?v=", "") + "/" + url.replace("https://www.youtube.com/watch?v=", "") + frame.toString() + '.png')
                .run();
        } else {
            ytdl(url).on("end", () => {
                ffmpeg("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv")
                    .on("end", () => {
                        if (!filesys.exists("./saves/" + url.replace("https://www.youtube.com/watch?v=", ""))) {
                            filesys.makefolder("./saves/" + url.replace("https://www.youtube.com/watch?v=", ""));
                        }
                        ffmpeg("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv")
                            .on("end", () => {
                                Jimp.read('./saves/' + url.replace("https://www.youtube.com/watch?v=", "") + "/" + url.replace("https://www.youtube.com/watch?v=", "") + frame.toString() + '.png')
                                    .then(image => {
                                        var width = image.bitmap.width;
                                        var height = image.bitmap.height;
                                        var pixels = [];
                                        for (var y = 0; y < height; y++) {
                                            var rowPixels = [];
                                            for (var x = 0; x < width; x++) {
                                                var pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
                                                rowPixels.push(`${pixel.r}, ${pixel.g}, ${pixel.b}`);
                                            }
                                            pixels.push(rowPixels);
                                        }
                                        socket.send(JSON.stringify({
                                            data: pixels
                                        }))
                                    });
                            })
                            .on("error", (err) => {})
                            .seek(frame / 1000)
                            .outputOptions(["-vframes", 1, "-q:v", 2])
                            .output('./saves/' + url.replace("https://www.youtube.com/watch?v=", "") + "/" + url.replace("https://www.youtube.com/watch?v=", "") + frame.toString() + '.png');
                    })
                    .inputFPS(20)
					.pipe(fs.createWriteStream("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv"));
            }).pipe(fs.createWriteStream("./request/" + url.replace("https://www.youtube.com/watch?v=", "") + ".mkv"));
        }
    });

    // When a socket closes, or disconnects, remove it from the array.
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
        console.log("Connection Disconnected")
    });
});
console.log("Server running on port 443");
