const express = require("express");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "paginas/explorar.html"));
});

app.use(express.static(__dirname));

app.listen(8080, () => console.log("Frontend running on port 8080"));