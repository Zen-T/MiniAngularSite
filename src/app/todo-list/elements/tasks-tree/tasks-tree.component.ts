import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../model/task';
import { TaskNode } from '../../model/taskNode';

@Component({
  selector: 'app-tasks-tree',
  template: `
    <link rel="stylesheet" href="tasks-tree.component.css">

    <!-- tasks tree droplist group -->
    <ul *ngIf="tasksTree" class="tasksTree" cdkDropListGroup>
      <!-- BSF show tree node -->
      <div *ngFor="let node of tasksTree">
        <!-- task tree item -->
        <app-task-tree-item [taskNode]="node"></app-task-tree-item>
      </div>
    </ul>

  `,
  styles: []
})

export class TasksTreeComponent implements OnChanges{
  @Input() tasksArr!: Task[];
  tasksTree!: TaskNode[];
  tasksDict: {[task_id: string]: Task} = {};

  ngOnChanges(changes: SimpleChanges){
    if (changes['tasksArr'] && this.tasksArr) {
      console.log("building new tree");
      this.buildTasksTree();
    }
  }

  // build tasksTree with recursive
  buildTaskNode(task: Task, parents_id: string[], parents_name: string[]): TaskNode{

    // make task node
    let taskNode = new TaskNode(task, [], parents_id, parents_name);

    // make new task parents list for child task node
    let child_parents_id: string[] = parents_id.slice();
    child_parents_id.push(task.id);

    let child_parents_name: string[] = parents_name.slice();
    child_parents_name.push(task.name);
    
    // find children task
    task.childs_id.forEach(child_id => {
      let child_task = this.tasksDict[child_id];
      if(child_task){
        taskNode.task_children.push(this.buildTaskNode(child_task, child_parents_id, child_parents_name));
      }
    })

    return taskNode;
  }

  buildTasksTree(){
    // optimized time complexity with dictionary and map
    this.tasksDict = {};
    let childrenIdDict: Set<string> = new Set();

    this.tasksArr.forEach(task =>{
      // store all tasks in dict for quick look up
      this.tasksDict[task.id] = task;

      // store all children task for quick look up
      task.childs_id.forEach(child_id => {
        childrenIdDict.add(child_id);
      })
    })

    // reset tasksTree
    this.tasksTree = [];

    // find tasks that do not have parent (task that not included in any tasks' children)
    this.tasksArr.forEach(task =>{
      if(!childrenIdDict.has(task.id)){
        this.tasksTree.push(this.buildTaskNode(task, [], []));
      }
    })
  }

}
