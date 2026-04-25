import { createHtmlWithCreateElement, createHtmlWithStrings } from "./render";

const state = {
            todos: [
                { text: 'Hi', completed: true },
                { text: 'Hello', completed: false },
                { text: 'Hi there!', completed: true },
            ],
            filter: 'all'
        };
/*
            Template:

            <li>
                <div class="view">
                    <input class="toggle" type="checkbox">
                    <label>aaa</label>
                    <button class="destroy"></button>
                </div>
            </li>
        */

const todoList = document.querySelector('.todo-list');
createHtmlWithStrings(state.todos, todoList);

