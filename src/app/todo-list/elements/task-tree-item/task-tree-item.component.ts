import { Component, Input } from '@angular/core';
import { TaskNode } from '../../model/taskNode';
import {CdkDrag, CdkDragDrop, CdkDragMove} from '@angular/cdk/drag-drop';
import { TodoListService } from 'src/app/core/service/todo-list.service';
import { Task } from '../../model/task';

@Component({
  selector: 'app-task-tree-item',
  template: `
    <div style="display: flex;">
      <!-- button hide task children -->
      <button *ngIf="taskNode.task_children.length" (click)="collapse()">></button>
      <!-- task + lvl item -->
      <div cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="dropToChangeParent($event)" style="display: flex;">
        <!-- task parents (lvl) item -->
        <div  *ngFor="let parent_id of taskNode.task_parents_id" id="{{parent_id}}" cdkDrag [cdkDragDisabled]="true"> _ </div>
        <!-- task item -->
        <div id="{{taskNode.task_info.id}}" cdkDrag [cdkDragData]="taskNode.task_info">
          {{ taskNode.task_info.name }}
        </div>
      </div>
    </div>

    <!-- task children -->
    <div *ngIf="showChildren">
      <div *ngFor="let childrenNode of taskNode.task_children">
        <app-task-tree-item [taskNode]="childrenNode"></app-task-tree-item>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class TaskTreeItemComponent {
  @Input() taskNode!: TaskNode;
  constructor(private taskService: TodoListService){}

  showChildren = true;
  collapse(){
    this.showChildren = !this.showChildren;
  }

  async dropToChangeParent(event: CdkDragDrop<string[]>) {
    // get source task ID
    const source_task_ID = event.item.data.id; // ID of the dragged item (event.item.element.nativeElement.id)
    
    // get old parent ID
    const old_parent_ID = event.item.data.parent_task;

    // get new parent ID
    let new_parent_Id = "";
    if(event.currentIndex > 0){
      new_parent_Id = event.container.element.nativeElement.children[event.currentIndex-1].id
    }

    // assign new parent to source task
    if(old_parent_ID != new_parent_Id){
      this.assignNewParent(source_task_ID, old_parent_ID, new_parent_Id);
    }

  }

  async assignNewParent(source_task_ID: string, old_parent_ID: string, new_parent_Id: string){
    // check if new parent
    if(old_parent_ID != new_parent_Id){
      // find old parent
      if(old_parent_ID != ""){
        // get old parent task info
        let old_parent_task: Task = await this.taskService.getTask(old_parent_ID);

        // remove id from old parent
        if(old_parent_task.id == old_parent_ID){
          old_parent_task.child_tasks = old_parent_task.child_tasks.filter(task_id => task_id !== source_task_ID);
          await this.taskService.updateTask(old_parent_task);
        }
      }

      // assign id to new parent
      if(new_parent_Id != ""){
        // get new parent task info
        let new_parent_task: Task = await this.taskService.getTask(new_parent_Id);

        // add id to new parent's children
        if(new_parent_task.id == new_parent_Id){
          new_parent_task.child_tasks.push(source_task_ID);
          await this.taskService.updateTask(new_parent_task);
        }
      }

      // assign new parent id
      let updated_task: Task = await this.taskService.getTask(source_task_ID);
      if(updated_task.id == source_task_ID){
        updated_task.parent_task = new_parent_Id;
        await this.taskService.updateTask(updated_task);
      }
    }
  }
}
