import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { TaskNode } from '../../model/taskNode';
import { CdkDrag, CdkDragDrop, CdkDragEnter, CdkDragExit, CdkDragMove, CdkDragRelease, CdkDragSortEvent, CdkDragStart} from '@angular/cdk/drag-drop';
import { TodoListService } from 'src/app/core/service/todo-list.service';
import { Task } from '../../model/task';

@Component({
  selector: 'app-task-tree-item',
  template: `
    <link rel="stylesheet" href="task-tree-item.component.css">

    <div>
      <!-- task + lvl item -->
      <div class="lvl-and-collapsible-task" cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="dropToChangeParent($event)" (cdkDropListEntered)="enterList($event)" (cdkDropListExited)="exitList($event)">
        <!-- task parents (lvl) item -->
        <div class="task-parents" *ngFor="let parent_id of taskNode.task_parents_id; let i = index;" id="{{parent_id}}" cdkDrag [cdkDragDisabled]="true" >
          <div class="task-parents-name">
            {{taskNode.task_parents_name[i]}}
          </div>
        </div>
        <!-- task item -->
        <div class="task-and-collapse-button" id="{{taskNode.task_info.id}}" cdkDrag [cdkDragData]="taskNode.task_info" (cdkDragStarted)="startDrag($event)" (cdkDragReleased)="releaseDrag($event)">
          <!-- cdk drag placeholder -->
          <div class="cdk-drag-placeholder" *cdkDragPlaceholder></div>
          <!-- button hide task children -->
          <div cdkDragHandle class="collapse-button">
            <img [ngClass]="{'done-task': taskNode.task_info.done}" src="assets/icon/circle-regular.svg" *ngIf="!taskNode.task_children.length"> <!-- no children -->
            <img [ngClass]="{'done-task': taskNode.task_info.done}" src="assets/icon/circle-right-regular.svg" *ngIf="taskNode.task_children.length && !showChildren" (click)="collapse()"> <!-- children hide -->
            <img [ngClass]="{'done-task': taskNode.task_info.done}" src="assets/icon/circle-down-regular.svg" *ngIf="taskNode.task_children.length && showChildren" (click)="collapse()"> <!-- children show -->
          </div>
          <!-- task item -->
          <app-task-item class="task-item" [task]="taskNode.task_info"></app-task-item>
        </div>
      </div>
    </div>

    <!-- task children -->
    <div *ngIf="!(this.taskNode.task_info.show_child == false) && showChildren">
      <div *ngFor="let childrenNode of taskNode.task_children">
        <app-task-tree-item [taskNode]="childrenNode" ></app-task-tree-item>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class TaskTreeItemComponent implements OnInit{
  @Input() taskNode!: TaskNode;
  constructor(private taskService: TodoListService,
              private renderer: Renderer2,
              private el: ElementRef){}

  ngOnInit(){
    try {if(this.taskNode.task_info.show_child != undefined){
      this.showChildren = this.taskNode.task_info.show_child;
    }} catch(e){}
  }
  
  showChildren: boolean = true;
  originSlot: any;

  collapse(){
    this.showChildren = !this.showChildren;
    this.taskService.updateTaskField(this.taskNode.task_info.id, {"show_child" : this.showChildren});
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
      // new parent can not be its children (a task can not be its own children task)
      if(!this.taskNode.task_parents_id.includes(source_task_ID)){
        this.assignNewParent(source_task_ID, old_parent_ID, new_parent_Id);
      }
      else{
        console.log("can not be its own children")
      }
    }
  }
  
  async checkNewParentNotItsOwnChild(parent_id: string, source_id: string): Promise <boolean>{
    if(parent_id != ""){
      // get parent task info
      let parent_task: Task = await this.taskService.getTask(parent_id);
      // check if parent is the source
      if(parent_task.id == source_id){
        return false;
      }
      return this.checkNewParentNotItsOwnChild(parent_task.parent_task, source_id);
    }
    return true;

  }

  async assignNewParent(source_task_ID: string, old_parent_ID: string, new_parent_Id: string){
    // check if new parent
    if(old_parent_ID != new_parent_Id){

      // check if new parent is its own children
      if(await this.checkNewParentNotItsOwnChild(new_parent_Id, source_task_ID)){

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
        let new_parent_cat = null;
        if(new_parent_Id != ""){
          // get new parent task info
          let new_parent_task: Task = await this.taskService.getTask(new_parent_Id);

          // get new parent cat
          new_parent_cat = new_parent_task.cat;

          // add id to new parent's children
          if(new_parent_task.id == new_parent_Id){
            new_parent_task.child_tasks.push(source_task_ID);
            await this.taskService.updateTask(new_parent_task);
          }
        }

        // assign new parent id & cat
        let updated_task: Task = await this.taskService.getTask(source_task_ID);
        if(updated_task.id == source_task_ID){
          updated_task.parent_task = new_parent_Id;
          if(new_parent_cat){
            updated_task.cat = new_parent_cat;
          }
          await this.taskService.updateTask(updated_task);
        }
      }
      else{
        console.log("can not be its own children")
      }

    }
  }

  enterList(event: CdkDragEnter<any>){
    // show parents block
    event.container.element.nativeElement.querySelectorAll('.task-parents').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', '#8bffe49c ');
      this.renderer.setStyle(target_element, 'border-right', 'solid #f9f90075 ');
    })

    // preview parent name when enter a drag list
    event.container.element.nativeElement.querySelectorAll('.task-parents-name').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'display', 'contents');
    })

    // show task item width block
    event.container.element.nativeElement.querySelectorAll('.task-and-collapse-button').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', '#8bffe49c ');
      this.renderer.setStyle(target_element, 'border-right', 'solid #f9f90075 ');
    })
  }

  exitList(event: CdkDragExit<any>){
    // hide parents block
    event.container.element.nativeElement.querySelectorAll('.task-parents').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', 'transparent');
      this.renderer.setStyle(target_element, 'border-right', 'none');
    })

    // hide parent name when enter a drag list
    event.container.element.nativeElement.querySelectorAll('.task-parents-name').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'display', 'none');
    })

    // hide parent name when enter a drag list
    event.container.element.nativeElement.querySelectorAll('.task-and-collapse-button').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', 'transparent');
      this.renderer.setStyle(target_element, 'border-right', 'none');
    })
  }

  startDrag(event: CdkDragStart<any>){
    // shorten task item width when task being dragged (to make selecting lvl easier)
    
    // 1. shorten all tasks (on this page) item width, class="task-and-collapse-button" width = 399px
    document.querySelectorAll('.task-and-collapse-button').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'width', '399px');
    })

    // 2. disable all tasks (on this page) item class="task-item-rig" by diable class="task-item" hover 
    document.querySelectorAll('.task-item').forEach((target_element)=>{
      this.renderer.setStyle(target_element,  'pointer-events', 'none');
    })

    // show this task's parents block when drag start
    event.source.dropContainer.element.nativeElement.querySelectorAll('.task-parents').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', '#8bffe49c ');
      this.renderer.setStyle(target_element, 'border-right', 'solid #f9f90075 ');
    })

    // show this task's parents name when drag start
    event.source.dropContainer.element.nativeElement.querySelectorAll('.task-parents-name').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'display', 'contents');
    })

    // show task original slot
    this.originSlot = event.source.dropContainer.element.nativeElement;
    this.renderer.setStyle(this.originSlot, 'background-color', '#c3e2d3cc');

  }

  releaseDrag(event: CdkDragRelease<any>){
    // recover task item and parent block when dragging stop

    // 1. recover from shorten task item width
    document.querySelectorAll('.task-and-collapse-button').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'width', '100%');
    })

    // 2. recover from disable class="task-item-rig" by diable class="task-item" hover 
    document.querySelectorAll('.task-item').forEach((target_element)=>{
      this.renderer.setStyle(target_element,  'pointer-events', 'all');
    })

    // hide all parents block in this page
    document.querySelectorAll('.task-parents').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'background-color', 'transparent');
      this.renderer.setStyle(target_element, 'border-right', 'none');
    })

    // hide parents name in this page
    document.querySelectorAll('.task-parents-name').forEach((target_element)=>{
      this.renderer.setStyle(target_element, 'display', 'none');
    })

    // hide task original slot
    this.renderer.setStyle(this.originSlot, 'background-color', 'transparent');
    this.originSlot = null;
  }
}
