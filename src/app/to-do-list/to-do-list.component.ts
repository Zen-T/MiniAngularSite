//start json server: "npx json-server --watch db.json"

import { Component, OnInit } from '@angular/core';
import { CrudService } from '../core/service/crud.service';
import { Task } from './model/task';
import { EditableModule } from '@ngneat/edit-in-place';
import { FormControl } from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  
  selector: 'app-to-do-list',
  template: `
  <link rel="stylesheet" href="to-do-list.component.css">

  <section class="section m-auto">
  <div class="columns is-centered">
    <div class="column is-half">
      <nav class="panel is-success">
        <p class="panel-heading hero is-primary is-bold">TODO LIST</p>
        <div class="panel-block">
          <div class="block m-auto">
            <div class="field is-grouped">
              <div class="control is-expanded">
                <!-- input box - New Task-->
                <input 
                  class="input is-success" 
                  type="text" 
                  placeholder="New Task" 
                  name="newTask"
                  [(ngModel)]="newTaskName"
                  #newTaskInput = "ngModel"
                  required>
              </div>
              <div class="control">
                <!-- add button -->
                <button 
                  class="button hero is-primary is-bold"
                  type="submit"
                  [disabled]="newTaskInput.invalid"
                  (click)="onAdd()">
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- show all tasks -->

        <div id="panel" *ngIf="allTasks">
          <div  
            class="panel-block" 
            *ngFor="let task of allTasks | async" 
            id="{{task.id}}"
            style="width: 30;
            justify-content: space-between;
            "
            >

            <span >

              <!-- show editable task name -->
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(edited_task)" >

                <ng-template viewMode><div [ngClass]="{'checked':task.checked}">{{ task.task_name }}</div></ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="edited_task.task_name"
                    />
                </ng-template>
              </editable>

              <!-- show editable task time estimate -->
              <div>
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(edited_task)" >

                <ng-template viewMode>Est {{ task.time_est }}</ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="edited_task.time_est"
                    />
                </ng-template>
              </editable>
              
              <!-- show editable task time actual -->
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(edited_task)" >

                <ng-template viewMode> - Act {{ task.time_act }}</ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="edited_task.time_act"
                    />
                </ng-template>
              </editable>
              </div>
            </span>

            <button class="c_button"  (click)="onChecking(task)">  </button>

            <div class="panel-icon">
              <img src="assets/icon/trashBin.png" (click)="onDel(task)">
            </div>
          </div>
        </div>
  `,
  styles: [
  ]
})
export class ToDoListComponent implements OnInit{

  allTasks!: any;
  taskArr: Task[] = [];


  newTaskName!: string;
  newTaskObj: Task = new Task();


  constructor(private taskService: CrudService){}

  ngOnInit(){
    this.newTaskName = "";
    this.newTaskObj = new Task();
    this.allTasks = this.taskService.getTasks();
  }


  onAdd(){
    this.newTaskObj.task_name = this.newTaskName;

    this.taskService.addTask(this.newTaskObj).subscribe
    (res => {this.ngOnInit()}, 
    err => {alert(err);})
  }

  onDel(etask : Task){
    this.taskService.delTask(etask).subscribe
    (res => {this.ngOnInit()}, 
    err => {alert("failed to delete");})
  }

  onEdit(etask : Task){
    this.taskService.editTask(etask).subscribe
    (res => {this.ngOnInit()}, 
    err => {alert("failed to edit");})
  }

  getControl(id: number) {
    console.log(id)
  }

  // edit in place
  edited_task: Task = new Task;


  assign_old_value(etask: Task){
    this.edited_task = etask;
  }

  onChecking(etask : Task){
    etask.checked = !etask.checked;
    this.onEdit(etask)
  }



}
