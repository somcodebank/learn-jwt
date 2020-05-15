require("dotenv").config();
const express = require("express"),
  app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
const posts = [
  { name: "yahoo-1", title: "title-01" },
  { name: "yahoo-2", title: "title-02" },
  { name: "yahoo-3", title: "title-03" },
  { name: "yahoo-2", title: "title-02" },
  { name: "yahoo-3", title: "title-03" },
];
const authenticateToken = (req, res, next) => {
  // headers: [("authentication": "Bearer (TOKEN)")];
  const authHeader = req.headers["authentication"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.get("/posts", authenticateToken, (req, res, next) => {
  const { user } = req.user;
  console.log({ posts, username: req.username });
  res.json(posts.filter((post) => post.name == user));
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { user: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

app.listen(3003, () => {
  console.log("listening 3003");
});

// const express = require("express"),
//   app = express();
// app.use(express.json());
// const posts = [
//   { name: "yahoo-1", title: "title-01" },
//   { name: "yahoo-2", title: "title-02" },
//   { name: "yahoo-3", title: "title-03" },
// ];
// app.get("/posts", (req, res, next) => {
//   res.json(posts);
// });
// app.post("/login", (req, res) => {
//   res.json(posts);
// });
// app.listen(3000, () => {
//   console.log("listening 3000 !");
// });
