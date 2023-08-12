import WebSocket, { WebSocketServer } from "ws";

const webSocketServer = new WebSocketServer({ port: 8080 });

const clients = [];

webSocketServer.on("connection", (socket) => {
  clients.push(socket);

  socket.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "message") {
      webSocketServer.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "message", data: data.data }));
        }
      });
    }
  });

  socket.on("close", () => {
    const index = clients.indexOf(socket);

    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});
