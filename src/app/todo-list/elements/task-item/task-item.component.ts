import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Task } from '../../model/task';
import { TodoListService } from 'src/app/core/service/todo-list.service';

@Component({
  selector: 'app-task-item',
  styleUrls: ["task-item.component.css"],
  template: `
    <li class="task-item" >
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
            <button mat-menu-item (click)="update_task_cat('')"></button>
            <button *ngFor="let cat of catsList" mat-menu-item (click)="update_task_cat(cat.name)">{{cat.name}}</button>
          </mat-menu>
        </div>
      </div>
      <!-- middle of the task item -->
      <div class="task-item-mid">
        <!-- editable task name -->
        <div class="task-name">
          <editable (click)="assign_origin_task_name()" (save)="update_task_name()">
            <ng-template viewMode>
              <div class="rollable-task-name" [ngClass]="{'task-done':task.done}" #rollableTaskName>{{ task.name }}</div>
            </ng-template>
            <ng-template editMode>
              <input editableOnEnter editableOnEscape [(ngModel)]="updated_task_name" style="height: 35px; width: 100%; font-size: x-large;"/>
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
            <!-- basic button for task without due date -->
            <div *ngIf="!this.task.time_due"  class="add-due-date-button" >
              <button mat-button (click)="picker.open()">
                <div class="button-label">
                  <img class="calendar-icon" src="assets/icon/calendar-plus-light.svg">
                </div>
              </button>
            </div>
            <!-- raised-button for task with due date -->
            <div *ngIf="this.task.time_due" class="show-due-date-button">
              <button mat-raised-button [ngClass]="due_color" (click)="picker.open()">
                <div class="button-label">
                  <img class="calendar-icon" src="assets/icon/calendar-plus-regular.svg">
                  <p>{{ due_reminder }}</p>
                </div>
              </button>
              <!-- img-button for clear date input -->
              <img class="clear-date" src="assets/icon/circle-xmark-regular.svg" (click)="clearPickedDate()">
            </div>
          </div>
          <!-- estimate time -->
          <div class="est-time">
            <!-- raised-button for task with EST TIME > 0 -->
            <button *ngIf="this.task.time_est>0" class="show-est-time-button" mat-raised-button>
              <editable (click)="assign_origin_task_est()" (save)="update_task_est()" >
                  <ng-template viewMode>
                    EST {{ task.time_est }} h
                  </ng-template>
                  <ng-template editMode>
                    <input editableOnEnter editableOnEscape [(ngModel)]="updated_task_est" type="number" style="width: 50px;"/>
                  </ng-template>
              </editable>
            </button>
            <!-- basic button for task with EST TIME == 0 -->
            <button *ngIf="!(this.task.time_est>0)" class="add-est-time-button" mat-button>
              <editable (click)="assign_origin_task_est()" (save)="update_task_est()" >
                  <ng-template viewMode>
                    EST
                  </ng-template>
                  <ng-template editMode>
                    <input editableOnEnter editableOnEscape [(ngModel)]="updated_task_est" type="number" style="width: 50px;"/>
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
          <img src="assets/icon/circle-check-regular.svg" (click)="toggle_task_state()">
        </div>
        <!-- edit task -->
        <div class="task-action-icon">
          <img src="assets/icon/pen-to-square-regular.svg">
        </div>
        <!-- delete task -->
        <div class="task-action-icon">
          <img src="assets/icon/trash-can-regular.svg" (click)="del_task()">
        </div>
      </div>
    </li>
`
})
export class TaskItemComponent implements OnInit{
  @Input() task!: Task;
  @ViewChild('rollableTaskName', {static: false}) rollableTaskName!: ElementRef;

  catsList!: any[];

  updated_task_name!: string;
  updated_task_est: number = 0;

  due_reminder: string = "";
  due_color: string = "due-away";

  constructor(
    private taskService: TodoListService,
    ){}


  ngOnInit(){
    // set looks for due date picker buttom
    this.setDueButtomReminderAndcolor();

    // assign updated_task_name
    this.updated_task_name = this.task.name;

    // assign updated_task_est
    this.assign_origin_task_est();
  }

  ngAfterViewInit() {
    this.checkTextOverflow();
  }

  checkTextOverflow() {
    const rollableTaskName = this.rollableTaskName.nativeElement;
    const isOverflowing = rollableTaskName.scrollWidth > 200;

    if (isOverflowing) {
      rollableTaskName.classList.add('text-overflow');
    } else {
      rollableTaskName.classList.remove('text-overflow');
    }
  }

  // set Due Buttom Reminder text And color
  setDueButtomReminderAndcolor(){
    if(this.task.time_due){
      // get task due time
      const taskDueDate = new Date(this.task.time_due)

      // get sys time
      const sysDate = new Date();

      // calculate day before due
      let secBeforeDue = taskDueDate.getTime() - sysDate.getTime();
      let dayBeforeDue = Math.ceil(secBeforeDue / (1000*3600*24));

      // set due buttom reminder and color
      this.due_reminder = dayBeforeDue + " day left";
      if(dayBeforeDue>=0){
        if(dayBeforeDue == 0){
          this.due_reminder = "Due";
          this.due_color = "due-today"
        }
        else if(dayBeforeDue == 1){
          this.due_color = "due-urgent"
        }
        else if(dayBeforeDue <= 3){
          this.due_color = "due-soon"
        }
        else if(dayBeforeDue <= 7){
          this.due_color = "due-coming"
        }
      }else{
        this.due_color = "due-passed"
        this.due_reminder = -dayBeforeDue + " day over due";
      }
    }
  }

  // assign origin name
  async assign_origin_task_name(){
      this.updated_task_name = this.task.name;
  }

  // update task name
  async update_task_name(){
    // check if task name changed
    if(this.updated_task_name != "" && this.updated_task_name != this.task.name){
      // update task name in db
      await this.taskService.updateTaskField(this.task.id,  {"name" : this.updated_task_name});
    }else{
      // new name illegal, reset 
      this.updated_task_name = this.task.name;
    }
  }

  // assign origin est
  async assign_origin_task_est(){
    if(this.task.time_est > 0){
      this.updated_task_est = this.task.time_est;
    }else{
      this.updated_task_est = 0;
    }
  }

  // update task est
  async update_task_est(){
    // check if task est
    if(this.updated_task_est >= 0 && this.updated_task_est != this.task.time_est){
      // update task est in db
      await this.taskService.updateTaskField(this.task.id,  {"time_est" : this.updated_task_est});
    }else{
      // new name illegal, reset
      this.assign_origin_task_est()
    }
  }

  // toggle task state
  async toggle_task_state(){
    this.taskService.addSysDateTime(this.task.id, "done", !this.task.done)
  }

  // del task
  async del_task(){
    await this.taskService.delTask(this.task.id)
  }

  // get cats list from local cache
  async getCatsList(){
    this.catsList = await this.taskService.getCatsNameFromCache();
  }

  // update task cat
  async update_task_cat(cat_name: string){
    // check if cat changed
    if(cat_name != this.task.cat){
      await this.taskService.updateTaskField(this.task.id,  {"cat" : cat_name});
    }
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