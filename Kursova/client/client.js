async function getUsers() {
  let response = await fetch("/listUsers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  let users = Object.values(await response.json());
  let rows = "";
  for (let user of users) {
    rows += row(user);
  }

  tbody = document.querySelector("tbody");
  tbody.insertAdjacentHTML("afterbegin", rows);
}

async function getUser(id) {
  let response = await fetch("/id?id=" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  let user = await response.json();

  let form = document.forms["userForm"];
  form.elements["id"].value = user.id;
  form.elements["user"].value = user.user;
  form.elements["name"].value = user.name;
  form.elements["age"].value = user.age;
  form.elements["ailment"].value = user.ailment;
}

async function createUser(user, name, age, ailment) {
  let response = await fetch("/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      user: user,
      name: name,
      age: age,
      ailment: ailment,
    }),
  });

  let newUser = Object.values(await response.json());
  newUser.user = user;
  newUser.name = name;
  newUser.age = age;
  newUser.ailment = ailment;
  reset();

  let tbody = document.querySelector("tbody");
  tbody.insertAdjacentHTML("beforeend", row(newUser));
}

async function editUser(id, user, name, age, ailment) {
  let response = await fetch("/changeUser", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      id: id,
      user: user,
      name: name,
      age: age,
      ailment: ailment,
    }),
  });

  let newUser = Object.values(await response.json());

  reset();

  let tr = document.querySelector(`tr[data-rowid="${user.id}"]`);
  tr.insertAdjacentHTML("beforebegin", row(newUser));
  tr.remove();
}

async function deleteUser(id) {
  let response = await fetch("/deleteUser?id=" + id, {
    method: "DELETE",
    header: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  let user = await response.json();

  let tr = document.querySelector(`tr[data-rowid="${user.id}"]`);
  tr.remove();
}

function reset() {
  let form = document.forms["userForm"];
  form.reset();
  form.elements["id"].value = 0;
}

function row(NewUser) {
  return `<tr data-rowid="${NewUser.id}">
              <td>${NewUser.id}</td>
              <td>${NewUser.user}</td>
              <td>${NewUser.name}</td>
              <td>${NewUser.age}</td>
              <td>${NewUser.ailment}</td>
              <td>
                <a class="editLink" data-id="${NewUser.id}">Change</a> |
                <a class="removeLink" data-id="${NewUser.id}">Remove</a>
              </td>
            </tr>`;
}

let resetBtn = document.getElementById("reset");

resetBtn.addEventListener("click", function (event) {
  event.preventDefault();
  reset();
});

let form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  let id = this.elements["id"].value;
  let user = this.elements["user"].value;
  let name = this.elements["name"].value;
  let age = this.elements["age"].value;
  let ailment = this.elements["ailment"].value;

  if (id == 0) {
    createUser(user, name, age, ailment);
  } else {
    editUser(id, user, name, age, ailment);
  }
});

document.body.addEventListener("click", function (event) {
  if (event.target.className != "editLink") return;

  let id = event.target.dataset.id;

  getUser(id);
});

document.body.addEventListener("click", function (event) {
  if (event.target.className != "removeLink") return;

  let id = event.target.dataset.id;

  deleteUser(id);
});

getUsers();
