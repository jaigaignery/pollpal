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

  console.log(id, question, options);
  const currentPolls = readDb();
  writeDb({
    ...currentPolls,
    [id]: {
      question,
      options: options.reduce((acc, curr) => {
        return { ...acc, [curr]: 0 };
      }, {}),
    },
  });
  res.sendStatus(200);
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

app.listen(port, () => console.log(`Server has started on port: ${port}`));
