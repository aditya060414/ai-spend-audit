import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("ai-spend-audit");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})