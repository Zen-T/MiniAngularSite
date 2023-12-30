import { Component, Input } from '@angular/core';
import { Task } from '../../model/task';
import { TaskNode } from '../../model/taskNode';
import { TodoListService } from 'src/app/core/service/todo-list.service';

@Component({
  selector: 'app-task-item',
  template: `
    <link rel="stylesheet" href="task-item.component.css">
    
    <li class="task-item">
          <!-- left of the task item -->
          <div class="task-item-lef">
            <!-- tag img -->
            <div class="tag-img">
              <img src="assets/icon/edit.png">
            </div>
            <!-- cat selection -->
            <div class="cat-select">
              <button mat-button [matMenuTriggerFor]="cats" (click)="getCatsList()">{{ task.cat }}</button>
              <mat-menu #cats="matMenu">
                <div *ngFor="let cat of catsList">
                <button mat-menu-item (click)="update_task_cat(task, cat.name)">{{cat.name}}</button>
                </div>
              </mat-menu>
            </div>
          </div>
          <!-- middle of the task item -->
          <div class="task-item-mid">
            <!-- editable task name -->
            <div class="task-name">
              <editable  (click)="assign_old_value(task)" (save)="update_task(updated_task)">
                <ng-template viewMode>
                  <div [ngClass]="{'task-done':task.done}">{{ task.name }}</div>
                </ng-template>
                <ng-template editMode>
                  <input editableOnEnter editableOnEscape [(ngModel)]="updated_task.name"/>
                </ng-template>
              </editable>
            </div>
            <!-- estimate time -->
            <div class="est-time">
              <editable (click)="assign_old_value(task)" (save)="update_task(updated_task)" >
                  <ng-template viewMode>
                    EST {{ task.time_est }} h
                  </ng-template>
                  <ng-template editMode>
                    <input editableOnEnter editableOnEscape [(ngModel)]="updated_task.time_est" type="number"/>
                  </ng-template>
              </editable>
            </div>

          </div>
          <!-- middle of the task item -->
          <div class="task-item-rig">          
            <!-- check task -->
            <div class="task-action-icon">
              <img src="assets/icon/circle-check-regular.svg" (click)="toggle_task_state(task)">
            </div>
            <!-- edit task -->
            <div class="task-action-icon">
              <img src="assets/icon/pen-to-square-regular.svg">
            </div>
            <!-- delete task -->
            <div class="task-action-icon">
              <img src="assets/icon/trash-can-regular.svg" (click)="del_task(task.id)">
            </div>
          </div>
        </li>
  `,
  styles: [
  ]
})
export class TaskItemComponent {
  @Input() task!: Task;
  newTask: Task = new Task();
  updated_task: Task = new Task();
  catsList: any[] = [];

  constructor(private taskService: TodoListService){
  }

  // set updated_task info to original value
  assign_old_value(task: Task){
    this.updated_task = task;
  }

  // update task info
  async update_task(updated_task : Task){
    await this.taskService.updateTask(updated_task).then(()=>{});
  }

  // toggle task state
  toggle_task_state(etask : Task){
    etask.done = !etask.done;
    this.update_task(etask)
  }

  // del task
  async del_task(task_Id: string){
    await this.taskService.delTask(task_Id).then(()=>{});
  }

  // get cats list
  async getCatsList(){
    this.catsList = await this.taskService.getCatsList();
  }

  // update task cat
  update_task_cat(etask : Task, cat_name: string){
    etask.cat = cat_name;
    this.update_task(etask)
  }
}
