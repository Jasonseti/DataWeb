import MongoDB from "./connectdb.mjs";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Int32 } from "mongodb";

const router = new express.Router();

// Login Session
const sessions = [];
const secretKey = "esdf1234op";
const createToken = (document) =>
  jwt.sign(document, secretKey, { expiresIn: "24h" });
// const verifyToken = (token) =>
//   jwt.verify(token, secretKey, (error, decoded) =>
//     error ? console.log("Token is invalid") : decoded
//   );

router.post("/sessions", (request, response) => {
  let query = request.body;
  MongoDB.authenticate(query).then((result) => {
    if (result) {
      let token = createToken({
        uid: result._id,
        username: result.username,
        admin: true,
      });
      console.log("Logged In.");
      sessions.push(token);
      response.status(200);
      response.send({ is_login: true, token: token });
    } else {
      response.status(200);
      response.send({ is_login: false });
    }
  });
});

router.delete("/sessions/:token", (request, response) => {
  const token = request.params.token;
  sessions.splice(sessions.indexOf(token), 1);
  response.sendStatus(204);
});

// Category API
router.get("/api/statistics/", (request, response) => {
  MongoDB.count()
    .then((results) => results.toArray())
    .then((data) => {
      console.log("Statistics retrieved.");
      response.status(200);
      response.send(data);
    });
});

// Table API
router.get("/api/items/id", (request, response) => {
  MongoDB.find({}, { projection: { _id: 0, ID: 1 } }, { ID: -1 }, 1)
    .then((results) => results.toArray())
    .then((results) => {
      response.status(200);
      response.send(results[0]);
    });
});
router.get("/api/items", (request, response) => {
  const { search, hide_sold, sort, ascending, category } = request.query;
  let query = { name: new RegExp(search, "i") };
  if (category !== "mix") {
    query.category = category;
  }
  if (hide_sold === "true") {
    query.date_sold = null;
  }
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
  let sort_options = { [sort]: ascending === "true" ? 1 : -1 };
  MongoDB.find(query, options, sort_options)
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
    response.sendStatus(204);
  });
});

router.put("/api/items", (request, response) => {
  const document = request.body;
  document.date_sold = document.date_sold && new Date(document.date_sold);
  let query = { ID: new Int32(document.ID) };
  let options = { $set: document };
  MongoDB.update(query, options).then(() => {
    console.log("Updated 1 document");
    response.sendStatus(204);
  });
});

router.delete("/api/items/:id", (request, response) => {
  let query = { ID: Number(request.params.id) };
  MongoDB.remove(query).then(() => {
    console.log("Deleted 1 documents");
    response.sendStatus(204);
  });
});

// API Liste
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router); // Have the router at the very end

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Running on port ${PORT}.`));
process.on("exit" || "SIGINT" || "uncaughtException", MongoDB.close);
