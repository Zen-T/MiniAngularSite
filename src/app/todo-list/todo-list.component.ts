//start json server: "npx json-server --watch db.json"
import { Component, OnInit } from '@angular/core';
import { onIdTokenChanged } from 'firebase/auth';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { FirestoreService } from '../core/service/firestore.service';
import { TodoListService } from '../core/service/todo-list.service';
import { Task } from '../todo-list/model/task';
import { collection, doc, onSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-todo-list',
  template: `
  <link rel="stylesheet" href="todo-list.component.css">

  <!-- app container -->
  <div class="todoApp-container">

    <!-- category picker (left side of the app) -->
    <div class="category-container">
      <app-cats-picker (cat_sele_map)="selectCat($event)"></app-cats-picker>
    </div>
    
    <!-- tasks viewer and day picker (right side of the app) -->
    <div class="todoList-container">
      <app-tasks-tree [tasks]="tasksArr"></app-tasks-tree>

      <!-- list of tasks -->
      <div class="tasks-container">
        <app-tasks-viewer [tasksArr]="tasksArr"></app-tasks-viewer>
      </div>
      <!-- date picker -->
      <div class="datePicker-container">
        <app-date-picker-hori (date_sele_map)="selectDate($event)"></app-date-picker-hori>
      </div>
    </div>
  </div>

  `,
  styles: [
  ]
})
export class TodoListComponent implements OnInit{

  constructor(
    private taskService: TodoListService,
    private authService: AuthFirebaseService,
    private storeService: FirestoreService){}

  cat_selection: object = {};
  date_selection: object = {};
  tasksArr: Task[] = [];

  ngOnInit(){
    // subscribe to login state
    onIdTokenChanged(this.authService.auth, (user) => {
      // user logged in
      if (user) {
        // subscribe database tasks changes
        onSnapshot(collection(this.storeService.db, "Users", user.uid, "/Apps/todoApp/Tasks"), (doc) => {
          // reload tasks list
          this.get_tasks();
        });
      }
      // no user logged in
      else {
        // empty local var
        this.tasksArr = [];
      }
    });
  }

  // get tasks with constraints
  async get_tasks(){
    // get all tasks in selected category
    this.tasksArr = await this.taskService.getDateTasks([this.cat_selection, this.date_selection]);
  }

  // select cat
  async selectCat(constraintMap: object){
    // update cat selection
    this.cat_selection = constraintMap;
    
    // get tasks
    this.get_tasks();
  }

  // select date
  async selectDate(constraintMap: object){
    // update date selection
    this.date_selection = constraintMap;
    
    // get tasks
    this.get_tasks();
  }
}
