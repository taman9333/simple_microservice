const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("profanity") ? "rejected" : "approved";
    data["status"] = status;

    await axios.post("http://event-bus-svc:9000/events", {
      type: "CommentModerated",
      data,
    });
  }

  res.send({});
});

app.listen("4003", () =>
  console.log("Moderation service listening on port 4003...")
);
