import { Component, input } from '@angular/core';
import { Todo } from '../../models/todo.type';
import {  HighlightCompletedTodo } from '../../directives/highlight-completed-todo';

@Component({
  selector: 'app-todo-item',
  imports: [  HighlightCompletedTodo],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemcomponent {
  todo = input.required<Todo>();
  todoToggled = output<Todo>();


  todoClicked() { this.todoToggled.emit(this.todo()); 
  }
}
