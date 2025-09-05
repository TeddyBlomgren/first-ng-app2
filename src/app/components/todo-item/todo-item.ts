import { Component, input } from '@angular/core';
import { Todo } from '../../models/todo.type';
import { HighlightCompletedTodoDirective } from '../../directives/highlight-completed-todo';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-todo-item',
  imports: [HighlightCompletedTodoDirective],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css'
})
export class TodoItemcomponent {
  todo = input.required<Todo>();
  @Output() todoToggled = new EventEmitter<Todo>();


  todoClicked() { this.todoToggled.emit(this.todo()); 
  }
}
