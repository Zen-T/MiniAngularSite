import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Task } from '../../model/task';
import { TodoListService } from 'src/app/core/service/todo-list.service';


@Component({
  selector: 'app-add-subtask',
  template: `
    <link rel="stylesheet" href="add-subtask.component.css">

    <div class="add-subtask-container">
      <!-- new Task input box -->
      <div class="add-subtask-info">
        <input 
          class="input" 
          placeholder="Add Sub-Task" 
          type="text"
          name="newTask"
          [(ngModel)]="newTask.name"
          #newTaskInput = "ngModel"
          (keyup.enter)="addTask()"
          *ngIf="!viewIniting"
          appClickedOutside
          (clickedOutside)="clickedOutEmit()"
          required
        >
      </div>
    </div>

  `,
  styles: [
  ]
})
export class AddSubtaskComponent implements AfterViewInit {
  @Input() parent_task_info!: Task;
  @Output() clickedOutside = new EventEmitter();

  newTask: Task = new Task();
  viewIniting: boolean = true; // 避免创建AddSubtaskComponent时，clickedOutside被错误多次激活
  
  constructor(private taskService: TodoListService){}

  ngAfterViewInit(){
    setTimeout(() => { // 避免ExpressionChangedAfterItHasBeenCheckedError
      this.viewIniting = false; // 设置为 false，表示组件已完全渲染
    });
  }

  // add new task to DB
  async addTask(){
    // get parent task from db
    let parent_task: Task = await this.taskService.getTask(this.parent_task_info.id);

    if(this.newTask.name != ""){
      // assign created time
      const sysTime = new Date();
      this.newTask.date_created = sysTime.getFullYear() * 10000 + (sysTime.getMonth()+1)  * 100 + sysTime.getDate();
      this.newTask.time_created = sysTime.toISOString();

      // assign selected cat
      this.newTask.cat_id = this.parent_task_info.cat_id;

      // assign parent id
      this.newTask.parent_id = this.parent_task_info.id;
      
      // add to database -- optimize? really need to get task from db before changing "childs_id"?
      await this.taskService.addTask(this.newTask).then(async (subtask_id)=>{
        console.log(subtask_id)
        // add new subtask's id to parent's children
        if(parent_task.id == this.parent_task_info.id){
          parent_task.childs_id.push(subtask_id);
          await this.taskService.updateTaskField(parent_task.id, {"childs_id": parent_task.childs_id});
        }

        // empty newTask
        this.newTask = new Task();
      })
    }
  }

  // emit when clickedoutside of the input box
  clickedOutEmit(){
    this.clickedOutside.emit();
  }
}