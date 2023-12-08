import { Task } from "./task";

export class TaskNode {
    task_info!: Task;
    task_children!: TaskNode[];

    constructor (task_info: Task, task_children: TaskNode[]){
        this.task_info = task_info;
        this.task_children = task_children;
    }
}