import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../model/task';
import { TodoListService } from 'src/app/core/service/todo-list.service';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

@Component({
  selector: 'app-task-item',
  styleUrls: ["task-item.component.css"],
  template: `
    <!-- <link rel="stylesheet" href="task-item.component.css"> -->
    
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
                  <input editableOnEnter editableOnEscape [(ngModel)]="updated_task.name" style="height: 35px; width: 100%; font-size: x-large;"/>
                </ng-template>
              </editable>
            </div>
            <!-- task info widget -->
            <div class="task-info-widget">
              <!-- due date picker -->
              <div class="due-date-picker">
                <mat-form-field style="display: none;">
                  <input matInput [matDatepicker]="picker"  [value]="task.time_due" (dateInput)="selectDueDate($event.value)">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker touchUi #picker>
                  </mat-datepicker>
                </mat-form-field>
                <!-- raised-button for task with due date -->
                <button *ngIf="this.task.time_due" class="show-due-date-button" mat-raised-button [ngClass]="button_color" (click)="picker.open()">
                  <img src="assets/icon/calendar-plus-regular.svg">
                  {{ due_reminder }}
                </button>
                <!-- basic button for task without due date -->
                <button *ngIf="!this.task.time_due"  class="add-due-date-button" mat-button (click)="picker.open()">
                  <img src="assets/icon/calendar-plus-regular.svg">
                  {{ due_reminder }}
                </button>
                <img *ngIf="this.task.time_due" class="clear-date" src="assets/icon/circle-xmark-regular.svg" (click)="clearPickedDate()">
              </div>
              <!-- estimate time -->
              <div class="est-time">
                <!-- raised-button for task with EST TIME > 0 -->
                <button *ngIf="this.task.time_est && this.task.time_est > 0" class="show-est-time-button" mat-raised-button>
                  <editable (click)="assign_old_value(task)" (save)="update_task(updated_task)" >
                      <ng-template viewMode>
                        EST {{ task.time_est }} h
                      </ng-template>
                      <ng-template editMode>
                        <input editableOnEnter editableOnEscape [(ngModel)]="updated_task.time_est" type="number" style="width: 50px;"/>
                      </ng-template>
                  </editable>
                </button>
                <!-- basic button for task with EST TIME == 0 -->
                <button *ngIf="!this.task.time_est || this.task.time_est == 0" class="add-est-time-button" mat-button>
                  <editable (click)="assign_old_value(task)" (save)="update_task(updated_task)" >
                      <ng-template viewMode>
                        EST
                      </ng-template>
                      <ng-template editMode>
                        <input editableOnEnter editableOnEscape [(ngModel)]="updated_task.time_est" type="number" style="width: 50px;"/>
                      </ng-template>
                  </editable>
                </button>
              </div>
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
  `
})
export class TaskItemComponent implements OnInit{
  @Input() task!: Task;
  newTask: Task = new Task();
  updated_task: Task = new Task();
  catsList: any[] = [];
  due_reminder: string = "";
  button_color: string = "";

  constructor(private taskService: TodoListService){}

  ngOnInit(){
    if(this.task.time_due){
      // get task due time
      const taskDueDate = new Date(this.task.time_due)

      // get sys time
      const sysDate = new Date();

      // get day before due
      let secBeforeDue = taskDueDate.getTime() - sysDate.getTime();
      let dayBeforeDue = Math.ceil(secBeforeDue / (1000*3600*24));
      if(dayBeforeDue>=0){
        if(dayBeforeDue<=1){
          this.due_reminder = dayBeforeDue + " day left";
          this.button_color = "due-now"
        }else{
          this.due_reminder = dayBeforeDue + " days left";
          if(dayBeforeDue<=7){
            this.button_color = "due-soon"
          }
          if(dayBeforeDue<=3){
            this.button_color = "due-urgent"
          }
        }
      }else{
        this.button_color = "due-passed"
        if(dayBeforeDue==-1){
          this.due_reminder = dayBeforeDue + " day over due";
        }else{
          this.due_reminder = dayBeforeDue + " days over due";
        }
      }
    }
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
    if (etask.done){
      this.taskService.addSysDateTime(etask, "done")
    }
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

  // set due date
  selectDueDate(selectedDueDate: Date){
    // conver to yyyymmdd
    let yyyymmdd: number | null = selectedDueDate.getFullYear() * 10000 + (selectedDueDate.getMonth()+1)  * 100 + selectedDueDate.getDate();
    let isoTime: string | null = selectedDueDate.toISOString();
    
    // update due date to database
    this.taskService.updateTaskField(this.task.id, {"date_due" : yyyymmdd, "time_due": isoTime});
  }

  // clear due date
  clearPickedDate(){
    this.taskService.updateTaskField(this.task.id, {"date_due" : null, "time_due": null});
  }
}
