import { Task } from "./task";

export class TaskNode {
    task_info!: Task;
    task_children!: TaskNode[];
    task_parents_id!: string[];
    task_parents_name!: string[];

    constructor (task_info: Task, task_children: TaskNode[], task_parents_id: string[], task_parents_name: string[]){
        this.task_info = task_info;
        this.task_children = task_children;
        this.task_parents_id = task_parents_id;
        this.task_parents_name = task_parents_name;
    }
}