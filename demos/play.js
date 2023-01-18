// The following functions are used to play a video or display an
// image on full screen, then stop the video or stop the full screen image display

///////////////////////////////////////////////////////
///////////////      Video              ///////////////
///////////////////////////////////////////////////////
const mpvAPI = require("node-mpv");
// where you want to initialize the API
const options = {
  audio_only: false,
  auto_restart: true,
  binary: null,
  debug: false,
  ipcCommand: null,
  socket: "/tmp/node-mpv.sock", // UNIX
  time_update: 1,
  verbose: false,
};
const mpv = new mpvAPI(options, ["--fullscreen"]);

// somewhere within an async context
// starts MPV
// mpv
//   .start()
//   .then(() => {
//     return mpv.load("../media/vid1.mp4");
//   })
//   .then(() => {
//     return mpv.getDuration();
//   })
//   .then((duration) => {
//     console.log(duration);
//     return mpv.getProperty("someProperty");
//   })
//   .then((property) => {
//     console.log(property);
//   })
//   // catches all possible errors from above
//   .catch((error) => {
//     // Maybe the mpv player could not be started
//     // Maybe the video file does not exist or couldn't be loaded
//     // Maybe someProperty is not a valid property
//     console.log(error);
//   });

const sys = require("child_process");
sys.execSync(`mpv media/vid1.mp4 --fullscreen`);
console.log("completed");
// setTimeout(() => {
//   sys.exec(`pkill -12 mpv`);
// }, 5000);

///////////////////////////////////////////////////////
///////////////      Image Terminal     ///////////////
///////////////////////////////////////////////////////

// const sys = require("child_process");
// sys.exec(`eog media/img1.png --fullscreen`);
// setTimeout(() => {
//   sys.exec(`pkill -12 eog`);
// }, 5000);
