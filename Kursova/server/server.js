const express = require("express");
const app = express();
const fs = require("fs");
const usersPath = `${__dirname}/users.json`;
const jsonParser = express.json();
app.use(express.static("../client/"));

app.get("/listUsers", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    res.end(data);
  });
});
app.post("/addUser", jsonParser, function (req, res) {
  const newUser = {
    user: req.body.user,
    name: req.body.name,
    age: req.body.age,
    ailment: req.body.ailment,
  };

  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = data ? JSON.parse(data) : {};
    let newCustomID;
    for (let i = 1; i < Object.values(allUsers).length + 1; i++) {
      if (!allUsers[i]) {
        newCustomID = i;
        break;
      }
    }
    if (!newCustomID) {
      newCustomID = Object.values(allUsers).length + 1;
    }
    newUser.id = newCustomID;
    allUsers[newCustomID] = newUser;
    fs.writeFile(usersPath, JSON.stringify(allUsers), function (err) {
      res.send(JSON.stringify(newUser));
      res.end();
    });
  });
});

app.delete("/deleteUser", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = data ? JSON.parse(data) : {};
    delete allUsers[req.query.id];
    fs.writeFile(usersPath, JSON.stringify(allUsers), function (err) {
      res.end();
    });
    res.end(data);
  });
});

app.get("/id", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = data ? JSON.parse(data) : {};
    res.end(JSON.stringify(allUsers[req.query.id]));
  });
});

app.get("/nameById", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = data ? JSON.parse(data) : {};

    res.end(allUsers[req.query.id].name);
  });
});

app.get("/ageById", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = data ? JSON.parse(data) : {};

    res.end(allUsers[req.query.id].age);
  });
});
app.get("/byName", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const usersWithNeededName = {};
    const allUsers = JSON.parse(data);

    Object.entries(allUsers).forEach(([key, value]) => {
      if (value.name === req.query.name) {
        usersWithNeededName[key] = value;
      }
    });

    res.end(JSON.stringify(usersWithNeededName));
  });
});
app.get("/byAge", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const usersWithNeededAge = {};
    const allUsers = JSON.parse(data);

    Object.entries(allUsers).forEach(([key, value]) => {
      if (value.age === req.query.age) {
        usersWithNeededAge[key] = value;
      }
    });

    res.end(JSON.stringify(usersWithNeededAge));
  });
});
app.get("/byUser", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const usersWithNeedUser = {};
    const allUsers = JSON.parse(data);

    Object.entries(allUsers).forEach(([key, value]) => {
      if (value.user === req.query.user) {
        usersWithNeedUser[key] = value;
      }
    });

    res.end(JSON.stringify(usersWithNeedUser));
  });
});
app.get("/getByAilment", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const usersWithNeedAilment = {};
    const allUsers = JSON.parse(data);

    Object.entries(allUsers).forEach(([key, value]) => {
      if (value.ailment === req.query.ailment) {
        usersWithNeedAilment[key] = value;
      }
    });

    res.end(JSON.stringify(usersWithNeedAilment));
  });
});
app.delete("/deleteAllUser", function (req, res) {
  fs.writeFile(usersPath, "", function (err) {
    res.end();
  });
  res.end(data);
});
app.put("/changeUser", jsonParser, function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const newUser = {
      id: req.body.id,
      user: req.body.user,
      name: req.body.name,
      age: req.body.age,
      ailment: req.body.ailment,
    };

    const allUsers = data ? JSON.parse(data) : {};
    if (allUsers[req.body.id]) {
      allUsers[req.body.id] = newUser;
      fs.writeFile(usersPath, JSON.stringify(allUsers), function (err) {
        res.send(JSON.stringify(newUser));
        res.end();
      });
    }
  });
});
app.get("/getAllUniqNames", function (req, res) {
  fs.readFile(usersPath, "utf8", function (err, data) {
    const allUsers = JSON.parse(data);
    const allUsersNames = new Set();

    Object.values(allUsers).forEach(function (user) {
      allUsersNames.add(user.name);
    });
    res.end(JSON.stringify(Array.from(allUsersNames)));
  });
});
const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
