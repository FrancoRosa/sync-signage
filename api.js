const dgram = require("dgram");
const sys = require("child_process");

const multicast = "225.0.0.1";
const id = Date.now();
const fullscreen = true;
const playlist = [
  { video: true, file: "vid1.mp4", timeout: 3, timed: true },
  { video: false, file: "img1.png", timeout: 5, timed: true },
  { video: true, file: "vid2.mp4", timeout: 5, timed: true },
  { video: false, file: "img2.png", timeout: 5, timed: true },
  { video: true, file: "vid1.mp4", timeout: 3, timed: true },
  { video: false, file: "img1.png", timeout: 5, timed: true },
  { video: true, file: "vid2.mp4", timeout: 5, timed: true },
  { video: false, file: "img2.png", timeout: 5, timed: true },
  { video: true, file: "vid1.mp4", timeout: 3, timed: true },
  { video: false, file: "img1.png", timeout: 5, timed: true },
  { video: true, file: "vid2.mp4", timeout: 5, timed: true },
  { video: false, file: "img2.png", timeout: 5, timed: true },
];

let current;

const mediaDir = "media/";

const s = dgram.createSocket("udp4");

s.bind(8001, () => {
  s.addMembership(multicast);
  console.log("... listening");
});

s.on("message", (msg, rinfo) => {
  console.log(`${rinfo.address}:${rinfo.port} >> ${msg}`);
  const other = JSON.parse(msg);
  if (other.id < id) {
    if (other.msg.file !== current.file) {
      if (current.video) stopVideo();
      else hideImage();
    }
  }
});

const broadcast = (msg) => {
  s.send(JSON.stringify({ id, msg }), 8001, multicast);
};

const stopVideo = () => {
  console.log("killing video");
  try {
    sys.execSync(`pkill -12 mpv`);
  } catch (error) {
    console.log(error);
  }
};

const hideImage = () => {
  console.log("killing image");
  try {
    sys.execSync(`pkill -12 eog`);
  } catch (error) {
    console.log(error);
  }
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
    sys.exec(`mpv ${mediaDir + file} ${fullscreen && "--fullscreen"}`, () =>
      resolve(1)
    );
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
    sys.exec(`eog ${mediaDir + file} ${fullscreen && "--fullscreen"}`, () =>
      resolve(1)
    );
  });
};

// handle playList
const handlePlaylist = async (playlist) => {
  for (const element of playlist) {
    const { video, file, timed, timeout } = element;
    current = element;
    broadcast(element);
    if (video) {
      await playVideo(file, timed, timeout);
    } else {
      await showImage(file, timed, timeout);
    }
  }
};

handlePlaylist(playlist);
