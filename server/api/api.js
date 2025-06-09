import MongoDB from "./connectdb.mjs";
import express from "express";
import cors from "cors";
import { Int32 } from "mongodb";

const router = new express.Router();

router.get("/api/items/id", (request, response) => {
  MongoDB.find({}, { projection: { _id: 0, ID: 1 } }, { ID: -1 }, 1)
    .then((results) => results.toArray())
    .then((results) => {
      response.status(200);
      response.send(results[0]);
    });
});
router.get("/api/items", (request, response) => {
  let query = { name: new RegExp(request.query.search, "i") };
  let options = {
    projection: {
      _id: 0,
      ID: "$ID",
      name: "$name",
      color: "$color",
      weight: { $toString: "$weight" },
      purity: { $toString: "$purity" },
      stones: "$stones",
      date_sold: { $toString: "$date_sold" },
    },
  };
  MongoDB.find(query, options)
    .then((results) => results.toArray())
    .then((results) => {
      console.log("Found " + results.length + " results.");
      response.status(200);
      response.send(results);
    });
});

router.post("/api/items", (request, response) => {
  const document = request.body;
  MongoDB.insert(document).then(() => {
    console.log("Inserted 1 document");
    response.sendStatus(200);
  });
});

router.put("/api/items", (request, response) => {
  const document = request.body;
  document.date_sold = document.date_sold && new Date(document.date_sold);
  let query = { ID: new Int32(document.ID) };
  let options = { $set: document };
  MongoDB.update(query, options).then(() => {
    console.log("Updated 1 document");
    response.sendStatus(200);
  });
});

router.delete("/api/items/:id", (request, response) => {
  let query = { ID: Number(request.params.id) };
  MongoDB.remove(query).then(() => {
    console.log("Deleted 1 documents");
    response.sendStatus(200);
  });
});

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router); // Have the router at the very end

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Running on port ${PORT}.`));
process.on("exit" || "SIGINT" || "uncaughtException", MongoDB.close);
