const fs = require("fs");
const readLine = require("readline");

function readInput(question) {
  return new Promise(function (resolve) {
    let userInput = null;
    const rl = readLine.createInterface(process.stdin, process.stdout);
    rl.setPrompt(question + " : ");
    rl.prompt();
    rl.on("line", function (input) {
      userInput = input;
      rl.close();
    }).on("close", function () {
      resolve(userInput); // this is the final result of the function
    });
  });
}

function getTodosList() {
  try {
    const data = fs.readFileSync("todo.json", "utf8");
    const todoArray = JSON.parse(data);
    return todoArray;
  } catch (err) {
    console.error(err);
  }
}

function printAllTodos() {
  console.log("-> All the todos\n");
  const todoArray = getTodosList();

  if (!todoArray.length) {
    console.log("No todos here\n");
    return;
  }

  todoArray.forEach((todo) => {
    console.log(
      `${todo.id}. ${todo.title} ${todo.isCompleted ? "(Done)" : ""}`
    );
  });

  console.log();
}

function printMenu() {
  console.log("-> Select operation to perform\n");
  console.log("1. Add ToDo");
  console.log("2. Mark any todo as completed");
  console.log("3. Quit the app");
}

async function acceptOperation() {
  const selectedOption = await readInput("Enter option number");
  if (["1", "2", "3"].includes(selectedOption)) {
    return selectedOption;
  }
  console.log("Wrong option selected, retry again\n");
  return acceptOperation();
}

async function addTodo() {
  const title = await readInput("Enter todo title");

  const todoList = getTodosList();

  todoList.push({ id: todoList.length + 1, title, isCompleted: false });

  writeFileContents(JSON.stringify(todoList));
}

function writeFileContents(contents) {
  try {
    fs.writeFileSync("todo.json", contents);
  } catch (err) {
    console.error(err);
  }
}

async function markTodoDone() {
  const todoId = await readInput(
    "Enter todo id which you want to mark complete"
  );

  if (isNaN(todoId)) {
    // todoid is not a number
    console.log("Todo id should be number, retry again\n");
    return markTodoDone();
  }

  const todoList = getTodosList();

  if (+todoId < 0 || +todoId > todoList.length) {
    // todoid does not exist
    console.log("Todo id does not exist, retry again\n");
    return markTodoDone();
  }

  todoList[+todoId - 1].isCompleted = true;

  writeFileContents(JSON.stringify(todoList));
}

async function performOperation(choice) {
  switch (choice) {
    case 1:
      await addTodo();
      return;
    case 2:
      await markTodoDone();
      return;
    case 3:
      console.log("\nBye!, see you soon.");
      process.exit(1);
  }
}

async function app() {
  console.log();
  printAllTodos();
  printMenu();
  const selectedOperation = await acceptOperation();
  await performOperation(+selectedOperation);
  app();
}

console.log("********* Welcome to Todo App **********");
app();
