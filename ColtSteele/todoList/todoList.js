const toDoItems = [];
let command = prompt ('What would you like to do?');

while (command !== "quit" && command !== "q") {
    if (command === "new") {
    let newItem = prompt('Enter new todo:')
    toDoItems.push(newItem); 
    console.log(`${newItem} added to list`);
    command = prompt('what would you like to do?')
    } else if (command === "list") {
        console.log('**********');
    for (let i = 0; i < toDoItems.length; i++) {
        console.log(`${i}: ${toDoItems[i]}`);
    }
        console.log('**********');
    command = prompt('what would you like to do?')
    } else if (command === "delete") {
    let deleteIndex = parseInt(prompt('Enter index of todo to delete:'))
    if (deleteIndex < toDoItems.length && !Number.isNaN(deleteIndex)) {
    deleteItem = toDoItems.splice(deleteIndex,1);
    console.log (`${deleteItem} removed`);
    }  
    else {
        alert('Invalid index! Please enter another index of todo to delete:');
    }    
    command = prompt('what would you like to do?')
}
}

console.log('OK YOU QUIT THE APP');

