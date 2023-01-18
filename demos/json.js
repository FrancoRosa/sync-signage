const sys = require("child_process");

const playlist = [
  { video: true, file: "vid1.mp4", timeout: 3, timed: true },
  { video: false, file: "img1.png", timeout: 5, timed: true },
  { video: true, file: "vid2.mp4", timeout: 5, timed: true },
  { video: false, file: "img2.png", timeout: 5, timed: true },
];

const mediaDir = "media/";

const stopVideo = () => {
  console.log("killing video");
  sys.execSync(`pkill -12 mpv`);
};

const hideImage = () => {
  console.log("killing image");
  sys.execSync(`pkill -12 eog`);
};

const playVideo = (file, timed, timeout) => {
  return new Promise((resolve, reject) => {
    if (timed) {
      console.log("timed video");
      setTimeout(() => {
        stopVideo();
        resolve(1);
      }, timeout * 1000);
    }
    sys.exec(`mpv ${mediaDir + file} --fullscreen`, () => resolve(1));
  });
};

const showImage = (file, timed, timeout) => {
  return new Promise((resolve, reject) => {
    if (timed) {
      console.log("timeout image");
      setTimeout(() => {
        hideImage();
        resolve(1);
      }, timeout * 1000);
    }
    sys.exec(`eog ${mediaDir + file} --fullscreen`, () => resolve(1));
  });
};

// handle playList
const handlePlaylist = async (playlist) => {
  for (const element of playlist) {
    const { video, file, timed, timeout } = element;
    console.log("file:", file);
    if (video) {
      await playVideo(file, timed, timeout);
    } else {
      await showImage(file, timed, timeout);
    }
  }
};

handlePlaylist(playlist);
