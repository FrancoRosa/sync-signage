const dgram = require("dgram");
const s = dgram.createSocket("udp4");

const multicast = "225.0.0.1";

s.bind(8001, () => {
  s.addMembership(multicast);
  console.log("listening on all addresses");
});

s.on("message", (msg, rinfo) => {
  console.log(`${rinfo.address}:${rinfo.port} >> ${msg}`);
});

setInterval(() => {
  s.send(">> hello", 8001, multicast);
}, 3000);
