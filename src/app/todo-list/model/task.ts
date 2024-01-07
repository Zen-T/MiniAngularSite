import { Timestamp } from "firebase/firestore";

export class Task {
    id: string = "";

    name: string = "";
    detail: string = "";

    importance: number = 0;

    // yyyy mm dd
    date_created: number | null = null;
    date_due: number | null= null;
    date_started: number | null= null;
    date_done: number | null= null;

    // Date.toISOString()
    time_created: string | null= null;
    time_due: string | null= null;
    time_started: string | null= null;
    time_done: string | null= null;
    
    time_est: number | null = 0;
    time_used: number | null = 0;

    cat: string = "";
    sub_cat: string = "";
    tag: string[] = [];

    parent_task: string = "";
    child_tasks: string[] = [];
    task_level: number = 0;
    show_child: boolean = true;

    done: boolean = false;

    setTask (
        id: string, name: string, detail: string, importance: number, 
        date_created: number | null, date_due: number | null, date_started: number | null, date_done: number | null, 
        time_created: string | null, time_due: string | null, time_started: string | null, time_done: string | null, 
        time_est: number | null, time_used: number | null, cat: string, sub_cat: string, tag: string[], 
        parent_task: string, child_tasks: string[], task_level: number, show_child: boolean, done: boolean) {

        this.id = id;

        this.name = name;
        this.detail = detail;

        this.importance = importance;

        this.date_created = date_created;
        this.date_due = date_due;
        this.date_started = date_started;
        this.date_done = date_done;
        
        this.time_created = time_created;
        this.time_due = time_due;
        this.time_started = time_started;
        this.time_done = time_done;

        this.time_est = time_est;
        this.time_used = time_used;

        this.cat = cat;
        this.sub_cat = sub_cat;
        this.tag = tag;

        this.parent_task = parent_task;
        this.child_tasks = child_tasks;
        this.task_level = task_level;
        this.show_child = show_child;

        this.done = done;
    }
}