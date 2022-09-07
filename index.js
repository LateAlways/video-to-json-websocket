'use strict'

const ffmpegBin = require('ffmpeg-binary-linux-64bit');
const ytdl = require('ytdl-core');
const extractFrame = require("ffmpeg-extract-frame");
const ffmpeg = require("fluent-ffmpeg");
const filesys = require("./filesys");
const Jimp = require('jimp');
const fs = require("fs");
const WebSocket = require('ws');

if(!filesys.exists("./request") {
   filesys.makefolder("./request")
}

if(!filesys.exists("./saves") {
   filesys.makefolder("./saves")
}

async function doWork(url, frame) {
    return new Promise((resolve, reject) => {
        if(filesys.exists("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")) {
    		if(!filesys.exists("./saves/"+url.replace("https://www.youtube.com/watch?v=","")+"/")) {
    		    filesys.makefolder("./saves/"+url.replace("https://www.youtube.com/watch?v=","")+"/");
    		}
    		console.log("done")
    		ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
    		    .setFfprobePath(ffmpegBin.ffprobe())
    		    .setFfmpegpath(ffmpegBin())
    		    .on("end", ()=> {
    		        console.log("done")
    		        resolve();
    		    })
    		    .on("error", (err) => {
    		        reject(err);
    		    })
    		    .seek(frame / 1000)
    		    .outputOptions(["-vframes",1,"-q:v",2])
    		    .output('./saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+"-"+frame.toString()+'.jpg')
    		    .run();
    		/*extractFrame({
    			input: "./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv",
    			output: './saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+"-"+frame.toString()+'.jpg',
    			offset: frame
    		})*/
        } else {
            ytdl(url).on("end",() => {
                ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
                .setFfprobePath(ffmpegBin.ffprobe())
                .setFfmpegpath(ffmpegBin())
                .on("error", (err) => {
    		        reject(err);
    		    })
                .on("end", () => {
                    if(!filesys.exists("./saves/"+url.replace("https://www.youtube.com/watch?v=",""))) {
            		    filesys.makefolder("./saves/"+url.replace("https://www.youtube.com/watch?v=",""));
            		}
        			ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
        			.setFfprobePath(ffmpegBin.ffprobe())
            		    .setFfmpegpath(ffmpegBin())
            		    .on("end", ()=> {
            		        resolve();
            		    })
            		    .on("error", (err) => {
            		        reject(err);
            		    })
            		    .seek(frame / 1000)
            		    .outputOptions(["-vframes",1,"-q:v",2])
            		    .output('./saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+"-"+frame.toString()+'.jpg')
            		    .run();
        		})
        		.inputFPS(20)
        		.run()
        		
        		.pipe(fs.createWriteStream("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv"));
            }).pipe(fs.createWriteStream("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv"));
        }
    });
}

const server = new WebSocket.Server({
  port: process.env.PORT
});

let sockets = [];
server.on('connection', async function(socket) {
  sockets.push(socket);
    console.log("New Connection")
  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {
    const { action, video, frame } = JSON.parse(((Buffer.from(msg, 'base64')).toString("utf-8")));
    const url = video;
    console.log("Request: "+action + ", " + video + ", " + frame)
    const promise = new Promise((resolve, reject) => {
        if(filesys.exists("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")) {
    		if(!filesys.exists("./saves/"+url.replace("https://www.youtube.com/watch?v=","")+"/")) {
    		    filesys.makefolder("./saves/"+url.replace("https://www.youtube.com/watch?v=","")+"/");
    		}
    		
    		ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
    		    .setFfmpegPath(ffmpegBin())
    		    .on("end", ()=> {
    		        console.log("done")
    		        resolve();
    		    })
    		    .on("error", (err) => {
    		        reject(err);
    		    })
    		    .seek(frame / 1000)
    		    .outputOptions(["-vframes",1,"-q:v",2])
    		    .output('./saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+frame.toString()+'.jpg')
    		    .run();
    		/*extractFrame({
    			input: "./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv",
    			output: './saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+"-"+frame.toString()+'.jpg',
    			offset: frame
    		})*/
        } else {
            ytdl(url).on("end",() => {
                ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
                .setFfmpegPath(ffmpegBin())
                .on("error", (err) => {
    		        reject(err);
    		    })
                .on("end", () => {
                    if(!filesys.exists("./saves/"+url.replace("https://www.youtube.com/watch?v=",""))) {
            		    filesys.makefolder("./saves/"+url.replace("https://www.youtube.com/watch?v=",""));
            		}
        			ffmpeg("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv")
            		    .setFfmpegPath(ffmpegBin())
            		    .on("end", ()=> {
            		        resolve();
            		    })
            		    .on("error", (err) => {
            		        reject(err);
            		    })
            		    .seek(frame / 1000)
            		    .outputOptions(["-vframes",1,"-q:v",2])
            		    .output('./saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+frame.toString()+'.jpg')
            		    ;
        		})
        		.inputFPS(20)
        		
        		.pipe(fs.createWriteStream("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv"));
            }).pipe(fs.createWriteStream("./request/"+url.replace("https://www.youtube.com/watch?v=","")+".mkv"));
        }
    });
    //END PROMISE
    promise.then(() => {
        Jimp.read('./saves/'+url.replace("https://www.youtube.com/watch?v=","")+"/"+url.replace("https://www.youtube.com/watch?v=","")+frame.toString()+'.jpg')
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
            socket.send(((Buffer.from(JSON.stringify({ data: pixels }),"utf-8")).toString("base64")))
        });
    }, (err) => {
        console.log(err);
    });
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
    console.log("Connection Disconnected")
  });
});
console.log("Server running on port 443");
