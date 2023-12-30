import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../model/task';
import { TodoListService } from 'src/app/core/service/todo-list.service';


@Component({
  selector: 'app-add-task',
  template: `
    <link rel="stylesheet" href="add-task.component.css">

    <div class="add-task-container">
      <!-- new Task input box -->
      <div class="add-task-info">
        <input 
          class="input" 
          placeholder="New Task" 
          type="text"
          name="newTask"
          [(ngModel)]="newTask.name"
          #newTaskInput = "ngModel"
          required
        >
      </div>
  
      <!-- add button -->
      <div class="add-task-button">
        <button 
          class="button hero is-primary is-bold"
          type="submit"
          [disabled]="newTaskInput.invalid"
          (click)="add_task()">
          ADD
        </button>
      </div>
    </div>

  `,
  styles: [
  ]
})
export class AddTaskComponent{
  @Input() newTaskCat!: string;
  @Input() newTaskdate!: number;
  
  newTask: Task = new Task();
  
  constructor(private taskService: TodoListService){}

  // add new task to DB
  async add_task(){
    this.newTask.cat = this.newTaskCat;
    this.newTask.day = this.newTaskdate;
    await this.taskService.addTask(this.newTask).then(()=>{
      // empty newTask
      this.newTask = new Task();
    })
  }

}