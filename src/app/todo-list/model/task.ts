export class Task {
    id: string = "";

    name: string = "";
    detail: string = "";

    importance: number = 0;

    year: number = 0;
    month: number = 0;
    day: number = 0;
    time: number = 0;
    
    time_est: number = 0;
    time_used: number = 0;

    cat: string = "";
    sub_cat: string = "";
    tag: string[] = [];

    parent_task: string = "";
    child_tasks: string[] = [];
    task_level: number = 0;

    done: boolean = false;

    setTask (id: string, name: string, detail: string, importance: number, year: number, month: number, day: number, time: number, time_est: number, time_used: number, cat: string, sub_cat: string, tag: string[], parent_task: string, child_tasks: string[], task_level: number, done: boolean) {
        this.id = id;

        this.name = name;
        this.detail = detail;

        this.importance = importance;
        
        this.year = year;
        this.month = month;
        this.day = day;
        this.time = time;

        this.time_est = time_est;
        this.time_used = time_used;

        this.cat = cat;
        this.sub_cat = sub_cat;
        this.tag = tag;

        this.parent_task = parent_task;
        this.child_tasks = child_tasks;
        this.task_level = task_level;
        
        this.done = done;
    }
}