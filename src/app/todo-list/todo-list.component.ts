import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { onIdTokenChanged } from 'firebase/auth';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { FirestoreService } from '../core/service/firestore.service';
import { TodoListService } from '../core/service/todo-list.service';
import { Task } from '../todo-list/model/task';
import { QueryConstraint, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { CatsPickerComponent } from './elements/cats-picker/cats-picker.component';
import { DatePickerHoriComponent } from './elements/date-picker-hori/date-picker-hori.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-todo-list',
  template: `

  <link rel="stylesheet" href="todo-list.component.css">

  <!-- app container -->
  <div class="todoApp-container">

    <!-- category picker (left side of the app) -->
    <div *ngIf="catsDict" class="category-container">
      <app-cats-picker (cat_selection)="selectCat($event)" (state_selection)="selectState($event)" [catsDict]="catsDict" #appCatsPicker></app-cats-picker>
    </div>
    
    <!-- tasks viewer and day picker (right side of the app) -->
    <div class="todoList-container">
      <!-- list of tasks -->
      <div class="tasks-container">
        <!-- tasks tree -->
        <app-add-task *ngIf="tasksArr" [newTaskCat]="cat_selection" [newTaskDateDue]="date_selection"></app-add-task>
        <app-tasks-tree *ngIf="tasksArr" [tasksArr]="tasksArr"></app-tasks-tree>
      </div>
      <!-- date picker -->
      <div class="datePicker-container">
        <app-date-picker-hori class="app-date-picker-hori" (date_selection)="selectDate($event)" #appDatePickerHori></app-date-picker-hori>
      </div>
    </div>
  </div>

  `,
  styles: [
  ]
})
export class TodoListComponent implements AfterViewInit{
  @ViewChild('appCatsPicker') appCatsPicker!: CatsPickerComponent;
  @ViewChild('appDatePickerHori') appDatePickerHori!: DatePickerHoriComponent;

  // init as undefine, wait for children componment to set these vars
  cat_selection!: string;
  date_selection!: Date | null;
  state_selection!: "todo" | "ongoing" | "done" | "all";

  // init as undefine, wait for ngAfterViewInit to use AuthFirebaseService set uid
  uid!: string | null;
  
  unsubCat: any; // store var to unsubscribe firebase cat listener
  catsDict!: { [key: string]: string }; // store cats list data

  unsubTasks: any; // store var to unsubscribe firebase tasks listener
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
        // check if all sub components output were 
        // get cats with listener
        this.setCatsListener();
        // get tasks with listener
        this.setTasksListener();
      }
      // if no user logged in
      else {
        // unsubsribe cats
        if(this.unsubCat !== undefined){
          this.unsubCat();
        }
        // unsubsribe tasks
        if(this.unsubTasks !== undefined){
          this.unsubTasks();
        }
        // empty local var
        this.uid = null;
        this.catsDict = {};
        this.tasksArr = [];
      }
    });
  }

  // after componment destory
  ngOnDestroy(){
    // unsubsribe listener before component being destoried
    if(this.unsubCat !== undefined){
      this.unsubCat();
    }
    if(this.unsubTasks !== undefined){
      this.unsubTasks();
    }
  }

  // get cats with listener
  setCatsListener(){
   
    // check if all constraint are initalized
    if(typeof this.uid === "string"){

      // unsubsribe before init a new listener
      if(this.unsubCat !== undefined){
        this.unsubCat();
        console.log("unSubCats")
      }

      // subscribe database catsList changes
      this.unsubCat = onSnapshot(doc(this.firestoreService.db, "Users", this.uid, "/Apps/todoApp/Categories/catsList"), (doc) => {
        // resr catsDict before assigning it
        this.catsDict = {};

        // parse doc to cat
        const doc_data = doc.data()
        if (doc_data != null) {
          Object.entries(doc_data).forEach((catInfo: any[]) => {
            const cat_id: string = catInfo[0];
            const cat_name: string = catInfo[1];
            Object.assign(this.catsDict, { [cat_id] :  cat_name });
          });
        }

        console.log("listening cats list")
        console.log(this.catsDict)

      });
    }
  }

  // get tasks by constraints with listener
  setTasksListener(){
   
    // check if all constraint are initalized
    if(typeof this.uid === "string" && this.cat_selection !== undefined && this.date_selection !== undefined && this.state_selection !== undefined){

      // unsubsribe before init a new listener
      if(this.unsubTasks !== undefined){
        this.unsubTasks();
        console.log("unsub")
      }

      // init constrains array
      const qConstraints: QueryConstraint[] = [];

      // add cat Constraint to constrains array
      if(this.cat_selection !== ""){
        qConstraints.push(where("cat_id", "==", this.cat_selection));
      }

      // add date Constraint to constrains array
      if(this.date_selection !== null){
        let yyyymmdd: number = this.date_selection.getFullYear() * 10000 + (this.date_selection.getMonth()+1)  * 100 + this.date_selection.getDate();
        qConstraints.push(where("date_due", "==", yyyymmdd));
      }

      // add task state Constraint to constrains array
      if(this.state_selection !== "all"){
        qConstraints.push(where("state", "==", this.state_selection));
      }

      // set up query
      const q = query(collection(this.firestoreService.db, "Users", this.uid, "/Apps/todoApp/Tasks"), ...qConstraints);
      
      // set up tasks upate listener
      this.unsubTasks = onSnapshot(q, (querySnapshot) => {
        let tasks : Task[] = [];
        // parse doc to task
        querySnapshot.forEach(async (doc) => {
          let task: Task = await this.taskService.buildTask(doc.data()); //tbo (to be optimized: dont use await?)
          task.cat_name = this.catsDict[task.cat_id]
          tasks.push(task);
        });
        this.tasksArr = tasks; //tbo (to be optimized: would you need this? if each time new task got pushed, the app-tasks-tree would update?)
        console.log(qConstraints)
        console.log(querySnapshot)
        console.log(this.tasksArr)
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
  selectState(state_selection: "todo" | "ongoing" | "done" | "all"){
    // update state selection
    this.state_selection = state_selection;
    
    // update tasks array
    this.setTasksListener();
  }
}
