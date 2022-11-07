(function () {
    fetch("/items", {method: 'GET'})
        .then(res => res.json())
        .then(updateTodos)
        .catch(console.error);

    const todoList = document.getElementById("todo-list");

    function updateTodos(todos) {
        todoList.innerHTML = '';
        // container.replaceChildren(...arrayOfNewChildren);
        todos.forEach(addTodo);
    }

    todoList.addEventListener("click", e => {
        const done = e.target.checked;
        if (done) {
            moveToDone(e.target);
        }
    });

    function moveToDone(todoCheck) {
        const todo = todoCheck.parentNode
        const payload = {
            done: true,
        };

        fetch(`/items/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(todos => {
                updateTodos(todos);
                console.log("move todo to done.");
            })
            .catch(console.error);
    }

    const addTodoBtn = document.getElementById("add-todo-btn");
    addTodoBtn.addEventListener("click", e => {
        const todo = document.getElementById("todo-input").value;

        if (todo !== '') {
            const payload = {
                todo,
                done: false,
            };

            fetch("/items", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(todos => {
                    updateTodos(todos);
                })
                .catch(console.error);
        }
    });

    function addTodo(todo) {
        const todoEl = document.createElement('li');
        todoEl.setAttribute('class', 'list-group-item');
        todoEl.setAttribute('id', todo.id);

        const todoCheck = document.createElement('input');
        todoCheck.setAttribute('class', 'form-check-input');
        todoCheck.type = "checkbox";
        todoCheck.name = "done";
        todoCheck.checked = todo.done;

        const todoTxt = document.createTextNode(todo.todo);

        todoEl.appendChild(todoCheck);
        todoEl.appendChild(todoTxt);

        todoList.appendChild(todoEl);
    }
})();
