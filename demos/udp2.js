const start = Date.now();
const UDP = require("dgram");
console.log();

const server = UDP.createSocket("udp4");

const port = 2222;

server.on("listening", () => {
  // Server address it’s using to listen

  const address = server.address();

  console.log(
    "Listining to ",
    "Address: ",
    address.address,
    "Port: ",
    address.port
  );
  setInterval(() => {
    server.send(`udp2 ${Date.now()}`, 2222, `255.255.255.0`, (err) => {
      if (err) {
        console.error("Failed to send response !!");
      } else {
        console.log("Response send Successfully");
      }
    });
  }, 5000);
});

server.on("message", (message, info) => {
  console.log("Message", message.toString());

  const response = Buffer.from("Message Received");
  console.log(response, info.port, info.address);
  //sending back response to client

  // server.send(response, info.port, info.address, (err) => {
  //   if (err) {
  //     console.error("Failed to send response !!");
  //   } else {
  //     console.log("Response send Successfully");
  //   }
  // });
});

server.bind(port);
