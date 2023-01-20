const dgram = require("dgram");
const sys = require("child_process");

const multicast = "225.0.0.1";
const id = Date.now();
const fullscreen = false;
const playlist = require("./paylist");

let current;
let other;
let sync = true;

const mediaDir = "media/";

const s = dgram.createSocket("udp4");

s.bind(8001, () => {
  s.addMembership(multicast);
  console.log("... listening");
});

s.on("message", (msg, rinfo) => {
  console.log(`${rinfo.address}:${rinfo.port} >> ${msg}`);
  other = JSON.parse(msg);
  if (other.id < id) {
    if (other.msg.id !== current.id) {
      sync = false;
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
    console.log("... error killing");
  }
};

const hideImage = () => {
  console.log("killing image");
  try {
    sys.execSync(`pkill -12 eog`);
  } catch (error) {
    console.log("... error killing");
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
    if (!sync) {
      if (current.id != other.msg.id) {
        continue;
      } else {
        sync = true;
      }
    }
    broadcast(element);
    if (video) {
      await playVideo(file, timed, timeout);
    } else {
      await showImage(file, timed, timeout);
    }
  }
};

handlePlaylist(playlist);
