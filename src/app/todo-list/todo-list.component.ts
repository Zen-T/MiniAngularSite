//start json server: "npx json-server --watch db.json"
import { Component, OnInit } from '@angular/core';
import { onIdTokenChanged } from 'firebase/auth';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { FirestoreService } from '../core/service/firestore.service';
import { TodoListService } from '../core/service/todo-list.service';
import { Task } from '../todo-list/model/task';
import { QueryConstraint, collection, onSnapshot, query, where } from 'firebase/firestore';

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
        <app-add-task *ngIf="tasksArr" [newTaskCat]="this.cat_selection" [newTaskDateDue]="this.date_selection"></app-add-task>
        <app-tasks-tree *ngIf="tasksArr" [tasksArr]="tasksArr"></app-tasks-tree>
      </div>
      <!-- date picker -->
      <div class="datePicker-container">
        <app-date-picker-hori class="app-date-picker-hori" (date_selection)="selectDate($event)"></app-date-picker-hori>
      </div>
    </div>
  </div>

  `,
  styles: [
  ]
})
export class TodoListComponent{

  // init as undefine, wait for children componment to set these vars
  cat_selection!: string;
  date_selection!: Date | null;
  state_selection!: boolean | null;

  // init as undefine, wait for ngAfterViewInit to use AuthFirebaseService set uid
  uid!: string | null;
  
  unsubTasks: any; // unsubscribe firebase tasks listener
  tasksArr!: Task[]; // store all tasks from listener

  constructor(
    private taskService: TodoListService,
    private authService: AuthFirebaseService,
    private firestoreService: FirestoreService){
  }

  // after view init
  ngAfterViewInit(){
    // subscribe to login state
    onIdTokenChanged(this.authService.auth, (user) => {
      // if user logged in
      if (user) {
        // get uid
        this.uid = user.uid;
        // set up tasks listener
        this.setTasksListener();
      }
      // if no user logged in
      else {
        // unsubsribe tasks
        if(this.unsubTasks !== undefined){
          this.unsubTasks();
        }
        // empty local var
        this.uid = null;
        this.tasksArr = [];
      }
    });
  }

  // after componment destory
  ngOnDestroy(){
    // unsubsribe tasks before component being destoried
    if(this.unsubTasks !== undefined){
      this.unsubTasks();
    }
  }

  // get tasks with constraints
  setTasksListener(){
   
    // check if all constraint are initalized
    if(typeof this.uid === "string" && this.cat_selection !== undefined && this.date_selection !== undefined && this.state_selection !== undefined){

      // unsubsribe before init a new listener
      if(this.unsubTasks !== undefined){
        this.unsubTasks();
      }

      // init constrains array
      const qConstraints: QueryConstraint[] = [];

      // add cat Constraint to constrains array
      if(this.cat_selection !== ""){
        qConstraints.push(where("cat", "==", this.cat_selection));
      }

      // add date Constraint to constrains array
      if(this.date_selection !== null){
        let yyyymmdd: number = this.date_selection.getFullYear() * 10000 + (this.date_selection.getMonth()+1)  * 100 + this.date_selection.getDate();
        qConstraints.push(where("date_due", "==", yyyymmdd));
      }

      // add task state Constraint to constrains array
      if(this.state_selection !== null){
        qConstraints.push(where("done", "==", this.state_selection));
      }

      // set up query
      const q = query(collection(this.firestoreService.db, "Users", this.uid, "/Apps/todoApp/Tasks"), ...qConstraints);

      // set up tasks upate listener
      this.unsubTasks = onSnapshot(q, (querySnapshot) => { //tbo (to be optimized: try catch needed?)
        let tasks : Task[] = [];
        // parse doc to task
        querySnapshot.forEach(async (doc) => {
          let task: Task = await this.taskService.buildTask(doc.data()); //tbo (to be optimized: dont use await?)
          tasks.push(task);
        });
        this.tasksArr = tasks; //tbo (to be optimized: would you need this? if each time new task got pushed, the app-tasks-tree would update?)
      });
    }
  }

  // select cat
  selectCat(cat_selection: string){
    // update cat selection
    this.cat_selection = cat_selection;
    
    // update tasks array
    this.setTasksListener();
  }

  // select date
  selectDate(date_selection: Date | null){
    // update date selection
    this.date_selection = date_selection;

    // update tasks array
    this.setTasksListener();
  }

  // select state
  selectState(state_selection: boolean | null){
    // update state selection
    this.state_selection = state_selection;
    
    // update tasks array
    this.setTasksListener();
  }
}
