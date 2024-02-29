import { Injectable } from '@angular/core';
import { Task } from 'src/app/todo-list/model/task';
import { FirestoreService } from './firestore.service';
import { query, orderBy, where, QueryConstraint } from "firebase/firestore";
import { SelectionChange } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  constructor(private dbService: FirestoreService ) { }

  // add task
  async addTask(newTask: Task): Promise <string>{
    let task_Id: string = "";

    try{
        await this.dbService.addDocInColl("Apps/todoApp/Tasks", JSON.parse(JSON.stringify(newTask))).then(async(doc_Id)=>{
        task_Id = doc_Id;
        
        // set task id
        this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + doc_Id, {'id': doc_Id});
      });
    } catch(e){
      console.error("Error adding task: ", e);
    }

    return task_Id;
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
      taskData.state,
      
      taskData.cat_id,
      taskData.cat_name,
      taskData.subcat_id,
      taskData.subcat_name,
      taskData.tags_id,
      taskData.tags_name,
  
      taskData.parent_id,
      taskData.childs_id,
      taskData.show_childs,
  
      taskData.time_est,
      taskData.time_used,
  
      taskData.date_created,
      taskData.date_due,
      taskData.date_started,
      taskData.date_done,
  
      taskData.time_created,
      taskData.time_due,
      taskData.time_started,
      taskData.time_done,
    );

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
  addSysDateTime(task_id: string, timeName: string, taskState?: "done" | "todo" | "ongoing"){
    // set field name
    const date_name = 'date_'+timeName
    const time_name = 'time_'+timeName

    // set time values
    const sysDate = new Date();
    const yyyymmdd = sysDate.getFullYear() * 10000 + (sysDate.getMonth()+1)  * 100 + sysDate.getDate();
    const isoTime = sysDate.toISOString();

    if(taskState==undefined){
      // update firebase doc
      this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + task_id, {[date_name] : yyyymmdd, [time_name] : isoTime});
    }else{
      if(taskState === "done"){
        this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + task_id, {[date_name] : yyyymmdd, [time_name] : isoTime, "state": taskState});
      }
      else{
        this.dbService.addMapInDoc("Apps/todoApp/Tasks/" + task_id, {"state": taskState});
      }
    }

  }

  // add cat
  async addCat(cat_name: string){
    try{
      // create new doc to store cat info
      let doc_id = await this.dbService.addDocInColl("Apps/todoApp/Categories", JSON.parse(JSON.stringify({"name":cat_name})));
      // update catslist
      await this.dbService.addMapInDoc("Apps/todoApp/Categories/catsList", {[doc_id]: [cat_name]});
    } catch(error){
      console.log("adding cat error:", error);  
    }
  }

  // remove cat and all Tasks under cat
  async removeCatAndItsTasks(cat_id: string){
    // remove tasks under this cat
    const tasksArr: Task[] = await this.getTasksByConstraints([{key: "cat_id", opt: "==", val: cat_id}]);
    tasksArr.forEach(task => {
      this.delTask(task.id);
    })

    // remove cat
    await this.dbService.removeDoc("Apps/todoApp/Categories/" + cat_id);

    // update catsList
    await this.dbService.deleteField("Apps/todoApp/Categories/catsList", cat_id);
  }

    // remove cat and all Tasks under cat
    async mergeCats(origin_cat_id: string, updated_cat_id: string){
      // change all tasks under this cat
      const tasksArr: Task[] = await this.getTasksByConstraints([{key: "cat_id", opt: "==", val: origin_cat_id}]);
      tasksArr.forEach(async task => {
        // update task's cat id 
        await this.dbService.addMapInDoc("/Apps/todoApp/Tasks/"+task.id, {cat_id: updated_cat_id});
      })

      // remove original cat
    await this.dbService.removeDoc("Apps/todoApp/Categories/" + origin_cat_id);

    // update catsList
    await this.dbService.deleteField("Apps/todoApp/Categories/catsList", origin_cat_id);
    }

  // update cat
  async updateCatName(cat_id: string, new_cat_name: string){
    // change cat_name
    await this.dbService.addMapInDoc("Apps/todoApp/Categories/"+cat_id, {name: new_cat_name});
    await this.dbService.addMapInDoc("Apps/todoApp/Categories/catsList", {[cat_id]: new_cat_name});
  }

  // get cat
  async getCatsListFromCache(): Promise<any[]>{
    let catsList: any[] = [];

    // retrieve doc
    const docData = await this.dbService.retrieveDocFromCache("/Apps/todoApp/Categories/catsList");

    if (docData != null) {
      // .push docData to cats array
      Object.entries(docData).forEach((catInfo: any[]) => {
        catsList.push({ id: catInfo[0], name: catInfo[1] });
      });
    }

    return catsList;
  }

}
