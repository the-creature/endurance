const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

function authenticate(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  const secret = db.get("secret").value();
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
}

// Generate password hash
function generateHash({ password, tokenSecret }) {
  return crypto
    .pbkdf2Sync(password, tokenSecret, 1000, 64, `sha512`)
    .toString(`hex`);
}

function generateAccessToken({ username, tokenSecret }) {
  // expires after half an hour (1800 seconds = 30 minutes)
  return jwt.sign({ username }, tokenSecret, { expiresIn: "30m" });
}

function isNumber(value) {
  return /^\d+$/.test(value);
}

const adapter = new FileSync("db.json");
const db = low(adapter);

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Create a token that the user can use in subsequent calls
app.post("/login", function (req, res) {
  const { username, password } = req.body;
  const user = db.get("users").find({ username }).value();
  const secret = db.get("secret").value();
  const hash = generateHash({
    password,
    tokenSecret: secret,
  });
  // if find user and password match, generate access token
  if (user && hash === user.password) {
    const token = generateAccessToken({
      username,
      tokenSecret: secret,
    });
    res.send({
      token,
      username,
      name: user.name,
    });
    return;
  }
  res.sendStatus(400);
});

// Get a list of breeds
app.get("/breed-list", authenticate, function (req, res) {
  const breeds = db
    .get("breeds")
    .map((item) => ({ id: item.id, name: item.name }))
    .value();
  if (breeds.length > 0) {
    res.json({
      doggos: breeds,
    });
  } else {
    res.sendStatus(404);
  }
});

// Get a list of doggos by breed
app.get("/doggos-list/:breedId", authenticate, function (req, res) {
  if (isNumber(req.params.breedId)) {
    const breed = breeds.find(
      (breed) => breed.id === parseInt(req.params.breedId)
    );
    const doggos = db
      .get("dogs")
      .filter((item) => item.breed.toLowerCase() === breed.name.toLowerCase())
      .value();

    if (doggos.length > 0) {
      res.json({
        doggos,
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

// Get a complete list of info about a breed
app.get("/breed/:breedId", authenticate, function (req, res) {
  if (isNumber(req.params.breedId)) {
    const breedId = parseInt(req.params.breedId);
    const breed = db.get("breeds").find({ id: breedId }).value();
    if (breed) {
      const { id, ...details } = breed;
      res.json({
        id: breedId,
        details,
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

// Add a new doggo
app.post("/doggo", authenticate, function (req, res) {
  const { id, details } = req.body;
  const doggo = db.get("dogs").find({ id });
  if (!doggo) {
    db.get("dogs")
      .push({
        id,
        ...details,
      })
      .write()
      .then(({ id, ...details }) =>
        res.json({
          id,
          details,
        })
      );
  } else {
    res.sendStatus(400);
  }
});

// Get a complete list of info about a doggo
app.get("/doggo/:doggoId", authenticate, function (req, res) {
  if (isNumber(req.params.doggoId)) {
    const doggoId = parseInt(req.params.doggoId);
    const doggo = db.get("dogs").find({ id: doggoId }).value();
    if (doggo) {
      const { id, ...details } = doggo;
      res.json({
        id: doggoId,
        details,
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

// Update doggo
app.put("/doggo/:doggoId", authenticate, function (req, res) {
  if (isNumber(req.params.doggoId)) {
    const { details } = req.body;
    const doggoId = parseInt(req.params.doggoId);
    const doggo = db.get("dogs").find({ id: doggoId }).value();
    if (doggo) {
      db.get("dogs")
        .find({ id: doggoId })
        .assign({ ...details })
        .write()
        .then(({ id, ...details }) =>
          res.json({
            id,
            details,
          })
        );
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(400);
  }
});

app.use("*", function (req, res) {
  res.sendStatus(400);
});

// set the port
const port = 3004;

// listen on the port
app.listen(port, function () {
  console.log(`API server listening on port ${port}!\n`);
});
