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
          (keyup.enter)="add_task()"
          required
        >
      </div>
  
      <!-- add button -->
      <div class="add-task-button">
        <button 
          class="button hero is-primary is-bold"
          type="submit"
          [disabled]="newTaskInput.invalid"
          (click)="add_task()"
          >
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
  @Input() newTaskDateDue!: Date | null;
  
  newTask: Task = new Task();
  
  constructor(private taskService: TodoListService){}

  // add new task to DB
  async add_task(){
    if(this.newTask.name != ""){
      // assign created time
      const sysTime = new Date();
      this.newTask.date_created = sysTime.getFullYear() * 10000 + (sysTime.getMonth()+1)  * 100 + sysTime.getDate();
      this.newTask.time_created = sysTime.toISOString();

      // assign selected cat
      this.newTask.cat = this.newTaskCat;

      // assign selected date as due date
      if(this.newTaskDateDue){
        this.newTask.date_due = this.newTaskDateDue.getFullYear() * 10000 + (this.newTaskDateDue.getMonth()+1)  * 100 + this.newTaskDateDue.getDate();
      }

      // add to database
      await this.taskService.addTask(this.newTask).then(()=>{
        // empty newTask
        this.newTask = new Task();
      })
    }
  }

}