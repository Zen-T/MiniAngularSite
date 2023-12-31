import { Injectable } from '@angular/core';
import { Task } from 'src/app/todo-list/model/task';
import { FirestoreService } from './firestore.service';
import { query, orderBy, where, QueryConstraint } from "firebase/firestore";

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

  // update task field
  async updateTaskField(task_id: string, updated_field: {}){
    await this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + task_id, updated_field);
  }

  // parse data for task
  async buildTask(taskData: any): Promise <Task>{
    let task = new Task;

    task.setTask(
      taskData.id, 

      taskData.name, 
      taskData.detail, 

      taskData.importance, 

      taskData.date_created, 
      taskData.date_due, 
      taskData.date_started, 
      taskData.date_done, 

      taskData.time_created, 
      taskData.time_due, 
      taskData.time_started, 
      taskData.time_done, 

      taskData.time_est, 
      taskData.time_used, 

      taskData.cat, 
      taskData.sub_cat, 
      taskData.tag, 

      taskData.parent_task, 
      taskData.child_tasks, 
      taskData.task_level, 
      taskData.show_child, 

      taskData.done);

    return task;
  }

  // get task
  async getTask(task_Id: string): Promise<Task>{

    // retrieve docs
    const docData = await this.dbService.retrieveDocDate("Apps/todoApp/Tasks/" + task_Id)

    // parse doc data to task
    const task: Task = await this.buildTask(docData);

    return task;
  }
  
  // get all tasks
  async getTasks(): Promise<Task[]>{
    let tasks: Task[] = [];

    // retrieve docs
    const docsData = await this.dbService.retrieveDocs("/Apps/todoApp/Tasks");

    // parse docs data for each task
    docsData.forEach(async (docData) => {

      // create task
      const task_Id = Object.keys(docData)[0];
      const task: Task = await this.buildTask(docData[task_Id]);

      // store task
      tasks.push(task);
    });

    return tasks;
  }

  // get tasks by constraintsMap
  async getTasksByConstraints(constraintsMap: any[]): Promise<Task[]>{
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
    docsData.forEach(async (docData) => {

      // create task
      const task_Id = Object.keys(docData)[0];
      const task: Task = await this.buildTask(docData[task_Id]);

      // store task
      tasks.push(task);
    });

    return tasks;
  }

  // update task time
  addSysDateTime(task: Task, timeName: string){
    // set field name
    const date_name = 'date_'+timeName
    const time_name = 'time_'+timeName

    // set time values
    const sysDate = new Date();
    const yyyymmdd = sysDate.getFullYear() * 10000 + (sysDate.getMonth()+1)  * 100 + sysDate.getDate();
    const isoTime = sysDate.toISOString();

    // update firebase doc
    this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + task.id, {[date_name] : yyyymmdd, [time_name] : isoTime});
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

    return cats;
  }

}
