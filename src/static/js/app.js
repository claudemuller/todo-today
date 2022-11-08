(function() {
    fetch('/items', { method: 'GET' })
        .then(res => res.json())
        .then(updateTodos)
        .catch(console.error);

    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');

    function updateTodos(todos) {
        todoList.innerHTML = '';
        doneList.innerHTML = '';
        // container.replaceChildren(...arrayOfNewChildren);
        todos.forEach(addTodo);
    }

    todoList.addEventListener('click', e => {
        const done = e.target.checked;
        if (done) {
            moveToDone(e.target);
        }
    });

    doneList.addEventListener('click', e => {
        const done = e.target.checked;
        if (!done) {
            moveToUnDone(e.target);
        }
    });

    function moveToUnDone(todoCheck) {
        const todo = todoCheck.parentNode;
        const payload = {
            done: false,
        };
        updateTodo(todo, payload);
    }

    function moveToDone(todoCheck) {
        const todo = todoCheck.parentNode;
        const payload = {
            done: true,
        };
        updateTodo(todo, payload);
    }

    function updateTodo(todo, payload) {
        fetch(`/items/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then(updateTodos)
            .catch(console.error);
    }

    const addTodoBtn = document.getElementById('add-todo-btn');
    addTodoBtn.addEventListener('click', e => {
        const todoInput = document.getElementById('todo-input');
        const todo = todoInput.value;

        if (todo !== '') {
            const payload = {
                todo,
                done: false,
            };

            fetch('/items', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
                .then(res => res.json())
                .then(todos => {
                    updateTodos(todos);
                    todoInput.value = '';
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
        todoCheck.type = 'checkbox';
        todoCheck.name = 'done';
        todoCheck.checked = todo.done;

        const todoTxt = document.createTextNode(todo.todo);

        const closeBtn = document.createElement('button');
        closeBtn.setAttribute('class', 'close');
        const closeBtnInner = document.createElement('span');
        closeBtnInner.innerHTML = '&times;';
        closeBtn.appendChild(closeBtnInner);

        todoEl.appendChild(todoCheck);
        todoEl.appendChild(todoTxt);
        todoEl.appendChild(closeBtn);

        if (todo.done) {
            doneList.appendChild(todoEl);
        } else {
            todoList.appendChild(todoEl);
        }
    }
})();
