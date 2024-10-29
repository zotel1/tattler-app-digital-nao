const express = require("express");

const server = express();

const PORT = 3000;
const HOST = "127.0.0.1";

server.get('/restaurantes', (req, res) => {
    res.status(200).send("OK");
});

server.listen(PORT, HOST, () => console.log(`Ejecutandose en http://${HOST}:${PORT}/restaurantes`));