import { Injectable } from '@angular/core';
import { Task } from 'src/app/to-do-list/model/task';
import { FirestoreService } from './firestore.service';
import { where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ToDoListService {

  constructor(private dbService: FirestoreService ) { }

  // add task
  async addTask(newTask: Task){
    await this.dbService.addDocInColl("Apps/todoApp/Tasks", JSON.parse(JSON.stringify(newTask))).then(async(doc_Id)=>{
      // set task id
      await this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + doc_Id, {'id': doc_Id});
    });
  }

  // remove task
  async delTask(doc_Id: string){
    await this.dbService.removeDoc("Apps/todoApp/Tasks/" + doc_Id);
  }

  // update task
  async updateTask(updated_task: Task){
    await this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + updated_task.id, JSON.parse(JSON.stringify(updated_task)));
  }

  // get tasks
  async getUndoneTasks(): Promise<Task[]>{
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

          docData[key].child_tasks, 
          docData[key].sub_level, 
          docData[key].done);
      });

      // store task
      tasks.push(task);
    });

    return tasks;
  }

}
