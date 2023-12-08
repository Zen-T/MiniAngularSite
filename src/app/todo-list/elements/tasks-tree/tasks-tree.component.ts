import { Component, Input } from '@angular/core';
import { Task } from '../../model/task';
import { TaskNode } from '../../model/taskNode';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

// 使用示例
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];

@Component({
  selector: 'app-tasks-tree',
  template: `
    <link rel="stylesheet" href="tasks-tree.component.css">
    <button (click)="test()"> test </button>

    <!-- show tree node -->
    <mat-tree [dataSource]="dataSource" [treeControl]="treeControl" class="example-tree" cdkDropList  (cdkDropListDropped)="drop($event)">
      <!-- when node has not child -->
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
          <!-- show task item -->
          <app-task-item [task]="node.task_info" cdkDrag [cdkDragData]="node.task_info"></app-task-item>
      </mat-tree-node>
      <!-- when node has child -->
      <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
        <div class="mat-tree-node" cdkDrag [cdkDragData]="node.task_info">
          <button mat-icon-button matTreeNodeToggle [attr.aria-label]="'Toggle ' + node.name">
            <mat-icon class="mat-icon-rtl-mirror">
              {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
            </mat-icon>
          </button>
          <!-- show task item -->
          <app-task-item [task]="node.task_info"></app-task-item>
        </div>
        <div [class.example-tree-invisible]="!treeControl.isExpanded(node)" role="group">
          <ng-container matTreeNodeOutlet></ng-container>
        </div>
      </mat-nested-tree-node>
    </mat-tree>
  `,
  styles: [
    
  ]
})

export class TasksTreeComponent {
  @Input() tasks!: Task[];
  tasksTree!: TaskNode[];
  tasksDict: {[task_id: string]: Task} = {};

  treeControl = new NestedTreeControl<TaskNode>(node => node.task_children);
  dataSource = new MatTreeNestedDataSource<TaskNode>();

  constructor() {
    this.dataSource.data = this.tasksTree;
  }

  hasChild = (_: number, node: TaskNode) => !!node.task_children && node.task_children.length > 0;

  // put tasks into tree
  // makeTasksTree(){
  //   // sort all tasks by level and task status
  //   this.tasks.sort((a,b) => {
  //     return a.task_level - b.task_level;
  //   })

  //   // make dictionary to find task in array with task_id
  //   let arrLoc = 0;
  //   this.tasks.forEach((task) =>{
  //     this.tasksId2Loc[task.id] = arrLoc;
  //     arrLoc += 1;
  //   })

  //   // put children tasks in parent task, and remove children tasks from all tasks
  //   this.tasks.forEach((task) =>{
  //     if(task.parent_task == ""){
  //       this.tasksTree.push(task);
  //     }
  //     else{
  //       // get parent task
  //       let parentArrLoc = this.tasksId2Loc[task.parent_task];
  //       let parent = this.tasks[parentArrLoc];
  //       // parent.child_tasks.push(task);
  //     }

  //   })

  //   // return tasks treed

  // }

  test(){
    this.buildTasksTree()
    this.dataSource.data = this.tasksTree;
    console.log(this.tasksTree);
  }

  // build tasksTree with recursive
  buildTaskNode(parentTask: Task): TaskNode{
    let taskNode = new TaskNode(parentTask, []);

    // find children task
    parentTask.child_tasks.forEach(child_id => {
      let child_task = this.tasksDict[child_id];

      if(child_task){
        taskNode.task_children.push(this.buildTaskNode(child_task));
      }

    })

    return taskNode;
  }

  buildTasksTree(){
    // optimized time complexity with dictionary and map
    this.tasksDict = {};
    let childrenIdDict: Set<string> = new Set();

    this.tasks.forEach(task =>{
      // record all tasks
      this.tasksDict[task.id] = task;

      // record all children task
      task.child_tasks.forEach(child_id => {
        childrenIdDict.add(child_id);
      })
    })

    // reset tasksTree
    this.tasksTree = [];

    // find tasks that do not have parent (task that not included in any tasks' children)
    this.tasks.forEach(task =>{
      if(!childrenIdDict.has(task.id)){
        this.tasksTree.push(this.buildTaskNode(task));
      }
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event, event.previousIndex, event.currentIndex);
  }

  
}
