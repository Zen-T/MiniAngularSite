import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../model/task';
import { TodoListService } from 'src/app/core/service/todo-list.service';


@Component({
  selector: 'app-tasks-viewer',
  template: `
    <link rel="stylesheet" href="tasks-viewer.component.css">

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

    <div *ngIf="tasksArr" class="tasks-list-container">
      <!-- to do tasks list -->
      <div *ngIf="todoTasks" class="todo-tasks">
        <p>To Do</p>
        <app-tasks-list [tasks] = "todoTasks"></app-tasks-list>
      </div>
      <!-- finished tasks list -->
      <div *ngIf="doneTasks" class="done-tasks">
        <p>Finished</p>
        <app-tasks-list [tasks] = "doneTasks"></app-tasks-list>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class TasksViewerComponent implements OnChanges{
  @Input() tasksArr!: Task[];
  @Input() newTaskCat!: string;
  @Input() newTaskdate!: number;
  
  todoTasks: Task[] = [];
  doneTasks: Task[] = [];

  newTask: Task = new Task();
  
  constructor(
    private taskService: TodoListService){}

  ngOnChanges(changes: SimpleChanges){
    if (changes['tasksArr']) {
      this.todoTasks = [];
      this.doneTasks = [];

      this.tasksArr.forEach(task => {
        if (!task.done){
          this.todoTasks.push(task);
        }
        else{
          this.doneTasks.push(task);
        }
        
      });
    }

  }

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