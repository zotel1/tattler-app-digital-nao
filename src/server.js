const express = require("express");

const server = express();

const PORT = 3000;
const HOST = "127.0.0.1";

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get('/restaurantes', (req, res) => {
    res.status(200).send("OK");
});

server.post('/restaurantes', (req, res) => {
    const { color } = req.body
})

server.listen(PORT, HOST, () => console.log(`Ejecutandose en http://${HOST}:${PORT}/restaurantes`));