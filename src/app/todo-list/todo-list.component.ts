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
      <app-cats-picker (cat_selection)="selectCat($event)" (state_selection)="selectState($event)"></app-cats-picker>
    </div>
    
    <!-- tasks viewer and day picker (right side of the app) -->
    <div class="todoList-container">
      <!-- list of tasks -->
      <div class="tasks-container">
        <!-- tasks tree -->
        <app-add-task [newTaskCat]="this.cat_selection" [newTaskdate]="this.date_selection"></app-add-task>
        <app-tasks-tree [tasksArr]="tasksArr"></app-tasks-tree>
        <!-- <app-tasks-viewer [tasksArr]="tasksArr" [newTaskCat]="this.cat_selection" [newTaskdate]="this.date_selection"></app-tasks-viewer> -->
      </div>
      <!-- date picker -->
      <div class="datePicker-container">
        <app-date-picker-hori (date_selection)="selectDate($event)"></app-date-picker-hori>
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

  cat_selection: string = "";
  date_selection: number = 0;
  state_selection!: boolean | null;

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
    
    // build cat Constraint Map for DB request
    let catConstraintMap = {};
    if(this.cat_selection != ""){
      catConstraintMap = {key: "cat", opt: "==", val: this.cat_selection};
    }

    // build date Constraint Map for DB request
    let dateConstraintMap = {};
    if(this.date_selection != 0){
      dateConstraintMap =  {key:"day", opt:"==", val: this.date_selection};
    }

    // build date Constraint Map for DB request
    let stateConstraintMap = {};
    if(this.state_selection != null){
      stateConstraintMap =  {key:"done", opt:"==", val: this.state_selection};
    }

    this.tasksArr = await this.taskService.getDateTasks([catConstraintMap, dateConstraintMap, stateConstraintMap]);
  }

  // select cat
  async selectCat(cat_selection: string){
    // update cat selection
    this.cat_selection = cat_selection;
    
    // update tasks array
    this.get_tasks();
  }

  // select date
  async selectDate(date_selection: number){
    // update date selection
    this.date_selection = date_selection;
    
    // update tasks array
    this.get_tasks();
  }

  // select state
  async selectState(state_selection: boolean | null){
    // update date selection
    this.state_selection = state_selection;
    console.log(state_selection)
    
    // update tasks array
    this.get_tasks();
  }
}
