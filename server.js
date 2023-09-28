const express = require("express");
const app = express();
const port = 8383;

const { readDb, writeDb } = require("./dbFunctions");

app.use(express.static("public"));
app.use(express.json());

//HTTP Routes
app.post("/", (req, res) => {
  const { id, question, options } = req.body;

  if (!id || !question || options.length == 0) {
    res.status(400).send({ status: "error" });
  }

  const currentPolls = readDb();
  writeDb({
    ...currentPolls,
    [id]: {
      question,
      options: Array.from(options).reduce((acc, curr) => {
        return { ...acc, [curr]: 0 };
      }, {}),
    },
  });
  res.redirect("/" + id);
});

app.get("/ids", (req, res) => {
  const ids = readDb();
  res.status(200).send({ ids: Object.keys(ids) });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    return res
      .status(200)
      .sendFile("poll.html", { root: __dirname + "/public" });
  } catch {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/data/:id", (req, res) => {
  const { id } = req.params;
  const data = readDb()[id];
  res.status(200).send({ data });
});

app.post("/vote", (req, res) => {
  console.log(req.body);
  const { id, vote } = req.body;
  const data = readDb();
  data[id]["options"][vote] += 1;
  writeDb(data);
  res.sendStatus(200);
});

app.listen(port, () => console.log(`Server has started on port: ${port}`));
