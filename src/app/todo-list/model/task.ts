export class Task {
    id: string = ""; // unique id

    name: string = ""; // title of task
    detail: string = ""; // detail description of task
    importance: number = 0;
    state: "todo" | "ongoing" | "done" = "todo";
    
    cat_id: string = ""; // cat id
    cat_name: string = ""; // only for web display, may not be up to date
    subcat_id: string = "";
    subcat_name: string = ""; // only for web display, may not be up to date
    tags_id: string[] = []; // tags id, array act like map in firebase
    tags_name: string[] = []; // tags id, array act like map in firebase, only for web display, may not be up to date

    parent_id: string = "";
    childs_id: string[] = []; // array act like map in firebase
    show_childs: boolean = true;

    time_est: number = 0;
    time_used: number = 0;

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
    
    setTask (
        id: string, name: string, detail: string, importance: number, state: "todo" | "ongoing" | "done",
        cat_id: string, cat_name: string, subcat_id: string, subcat_name: string, tags_id: string[], tags_name: string[],
        parent_id: string, childs_id: string[], show_childs: boolean, time_est: number, time_used: number, 
        date_created: number | null, date_due: number | null, date_started: number | null, date_done: number | null, 
        time_created: string | null, time_due: string | null, time_started: string | null, time_done: string | null, 
        ) {
            this.id = id;

            this.name = name;
            this.detail = detail;
            this.importance = importance;
            this.state = state;
            
            this.cat_id = cat_id;
            this.cat_name = cat_name;
            this.subcat_id = subcat_id;
            this.subcat_name = subcat_name;
            this.tags_id = tags_id;
            this.tags_name = tags_name;
        
            if (parent_id !== undefined) this.parent_id = parent_id; // check if undefined to avoid error during foreach loop in building task tree
            if (childs_id !== undefined) this.childs_id = childs_id; // check if undefined to avoid error during foreach loop in building task tree
            if (show_childs !== undefined) this.show_childs = show_childs;
        
            this.time_est = time_est;
            this.time_used = time_used;
        
            this.date_created = date_created;
            this.date_due = date_due;
            this.date_started = date_started;
            this.date_done = date_done;
        
            this.time_created = time_created;
            this.time_due = time_due;
            this.time_started = time_started;
            this.time_done = time_done;
        }
}