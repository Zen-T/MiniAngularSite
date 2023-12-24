import { Injectable } from '@angular/core';
import { Task } from 'src/app/todo-list/model/task';
import { FirestoreService } from './firestore.service';
import { query, orderBy, where, QueryConstraint } from "firebase/firestore";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor(private dbService: FirestoreService ) { }

  // add task
  async addTask(newTask: Task){
    await this.dbService.addDocInColl("Apps/todoApp/Tasks", JSON.parse(JSON.stringify(newTask))).then(async(doc_Id)=>{
      // set task id
      await this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + doc_Id, {'id': doc_Id});
    });
  }

  // remove task
  async delTask(task_Id: string){
    await this.dbService.removeDoc("Apps/todoApp/Tasks/" + task_Id);
  }

  // update task
  async updateTask(updated_task: Task){
    await this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + updated_task.id, JSON.parse(JSON.stringify(updated_task)));
  }

  // get tasks
  async getTask(task_Id: string): Promise<Task>{

    // retrieve docs
    const docData = await this.dbService.retrieveDocDate("Apps/todoApp/Tasks/" + task_Id)

    // create task variable
    let task = new Task;

    // parse doc data to task
    task.setTask(
      docData.id, 

      docData.name, 
      docData.detail, 

      docData.importance, 

      docData.year, 
      docData.month, 
      docData.day, 
      docData.time, 

      docData.time_est, 
      docData.time_used, 

      docData.cat, 
      docData.sub_cat, 
      docData.tag, 

      docData.parent_task, 
      docData.child_tasks, 
      docData.task_level, 

      docData.done);

    return task;
  }
  
  // get tasks
  async getTasks(): Promise<Task[]>{
    let tasks: Task[] = [];

    // retrieve docs
    const docsData = await this.dbService.retrieveDocs("/Apps/todoApp/Tasks");

    // parse docs data for each task
    docsData.forEach((docData) => {

      // create task
      let task = new Task;

      // assign task value to task object
      Object.keys(docData).forEach(function(key) {
        task.setTask(
          docData[key].id, 

          docData[key].name, 
          docData[key].detail, 

          docData[key].importance, 

          docData[key].year, 
          docData[key].month, 
          docData[key].day, 
          docData[key].time, 

          docData[key].time_est, 
          docData[key].time_used, 

          docData[key].cat, 
          docData[key].sub_cat, 
          docData[key].tag, 

          docData[key].parent_task, 
          docData[key].child_tasks, 
          docData[key].task_level, 

          docData[key].done);
      });

      // store task
      tasks.push(task);
    });

    return tasks;
  }

  // get tasks by year
  async getDateTasks(constraintsMap: any[]): Promise<Task[]>{
    let tasks: Task[] = [];

    // form query Constraints
    const qConstraints: QueryConstraint[] = [];
    constraintsMap.forEach((constraintMap)=>{
      if (Object.keys(constraintMap).length > 0){
        qConstraints.push(where(constraintMap.key, constraintMap.opt, constraintMap.val));
      }
    })

    // retrieve docs
    const docsData = await this.dbService.retrieveDocs("/Apps/todoApp/Tasks", qConstraints);

    // parse docs data for each task
    docsData.forEach((docData) => {

      // create task
      let task = new Task;

      // assign task value to task object
      Object.keys(docData).forEach(function(key) {
        task.setTask(
          docData[key].id, 

          docData[key].name, 
          docData[key].detail, 

          docData[key].importance, 

          docData[key].year, 
          docData[key].month, 
          docData[key].day, 
          docData[key].time, 

          docData[key].time_est, 
          docData[key].time_used, 

          docData[key].cat, 
          docData[key].sub_cat, 
          docData[key].tag, 
          
          docData[key].parent_task, 
          docData[key].child_tasks, 
          docData[key].task_level, 
          
          docData[key].done);
      });

      // store task
      tasks.push(task);
    });

    return tasks;
  }

  // add cat
  async addCat(cat_name: string){
    await this.dbService.addMapInDoc("Apps/todoApp/Categories/catsList", {[cat_name]: "img"});
  }

  // remove cat

  // update cat

  // get cat
  async getCatsList(): Promise<any[]>{
    let cats: any[] = [];

    // retrieve doc
    const docData = await this.dbService.retrieveDocDate("/Apps/todoApp/Categories/catsList");

    if (docData != null) {
      // .push docData to cats array
      Object.entries(docData).forEach((catInfo: any[]) => {
        cats.push({ name: catInfo[0], img: catInfo[1] });
      });
    }

    console.log(cats);

    return cats;
  }

  // subscriable date selection
  private selectedDateSubject = new BehaviorSubject<Object>({});
  selectedDate$ = this.selectedDateSubject.asObservable();

  setSelectedDate(constraintMap: any) {
    this.selectedDateSubject.next(constraintMap);
  }
}
