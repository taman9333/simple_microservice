const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  _handleEvent(type, data);

  res.send({});
});

app.listen("4002", async () => {
  console.log("Query service, listening on port 4002...");

  // syncing and geting all events in case query service is down because of any failure
  const res = await axios.get("http://localhost:9000/events");

  for (const event of res.data) {
    console.log("Processing event: ", event.type);

    _handleEvent(event.type, event.data);
  }
});

const _handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({ id, content, status });
  } else if (type === "CommentUpdated") {
    const { id, postId, status, content } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};
