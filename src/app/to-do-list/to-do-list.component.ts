//start json server: "npx json-server --watch db.json"
import { Component, OnInit } from '@angular/core';
import { onIdTokenChanged } from 'firebase/auth';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { FirestoreService } from '../core/service/firestore.service';
import { doc, onSnapshot } from "firebase/firestore";

import { FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ToDoListService } from '../core/service/to-do-list.service';
import { Task } from './model/task';

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
                  [(ngModel)]="newTask.name"
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
        <div id="panel" *ngIf="taskArr">
          <div *ngFor="let task of taskArr" id="{{task.id}}" class="panel-block" >

            <span >
              <!-- show editable task name -->
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(updated_task)" >

                <ng-template viewMode><div [ngClass]="{'checked':task.done}">{{ task.name }}</div></ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="updated_task.name"/>
                </ng-template>
              </editable>

              <!-- show editable task time estimate -->
              <div>
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(updated_task)" >

                <ng-template viewMode>Est {{ task.time_est }}</ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="updated_task.time_est"
                    />
                </ng-template>
              </editable>
              
              <!-- show editable task time actual -->
              <editable
                (click)="assign_old_value(task)"
                (save)="onEdit(updated_task)" >

                <ng-template viewMode> - Act {{ task.time_used }}</ng-template>

                <ng-template editMode>
                  <input 
                    editableOnEnter 
                    editableOnEscape 
                    [(ngModel)]="updated_task.time_used"
                    />
                </ng-template>
              </editable>
              </div>
            </span>

            <button class="c_button"  (click)="onChecking(task)">  </button>

            <div class="panel-icon">
              <img src="assets/icon/trashBin.png" (click)="onDel(task.id)">
            </div>
          </div>
        </div>

        <!-- date select button -->
        <div class="date-select">

        </div>
  `,
  styles: [
  ]
})
export class ToDoListComponent implements OnInit{

  newTask: Task = new Task();
  updated_task: Task = new Task();
  taskArr: Task[] = [];

  constructor(
    private taskService: ToDoListService,
    private authService: AuthFirebaseService,
    private storeService: FirestoreService){}

  async ngOnInit(){
    // subscribe to login state
    onIdTokenChanged(this.authService.auth, async(user) => {
      // user logged in
      if (user) {
        this.taskArr = await this.taskService.getUndoneTasks();
        console.log(this.taskArr);} 
      // no user logged in
      else {
        // empty local var
        this.taskArr = [];
      }
    });
  }

  // add new task to DB
  async onAdd(){
    await this.taskService.addTask(this.newTask).then(()=>{
      this.newTask = new Task();
      this.ngOnInit();
    })
  }

  // set updated_task info to original value
  assign_old_value(task: Task){
    this.updated_task = task;
  }

  // update task info
  onEdit(updated_task : Task){
    this.taskService.updateTask(updated_task);
  }

  onChecking(etask : Task){
    etask.done = !etask.done;
    this.onEdit(etask)
  }

  onDel(task_Id: string){
    this.taskService.delTask(task_Id);
  }

}
