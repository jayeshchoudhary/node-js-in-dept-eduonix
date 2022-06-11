const fs = require("fs");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function printAllTodos() {
  console.log("-> All the todos\n");

  try {
    const data = fs.readFileSync("todo.json", "utf8");
    const todoArray = JSON.parse(data);
    todoArray.forEach((todo) => {
      console.log(
        `${todo.id}. ${todo.title} ${todo.isCompleted ? "(Done)" : ""}`
      );
    });
  } catch (err) {
    console.error(err);
  }
  console.log();
}

function printMenu() {
  console.log("-> Select operation to perform\n");
  console.log("1. Add ToDo");
  console.log("2. Mark any todo as completed");
  console.log("3. Quit the app");
}

async function acceptOperation() {
  await new Promise((resolve) => {
    rl.question("What is Op number? ", (opn) => {
      if (["1", "2", "3"].includes(opn)) {
        return opn;
      } else {
        acceptOperation();
      }
    });
  });
}

function app() {
  console.log("********* Welcome to Todo App **********\n");
  printAllTodos();
  printMenu();
  const selectedOperation = acceptOperation();
  rl.close();
}

app();
