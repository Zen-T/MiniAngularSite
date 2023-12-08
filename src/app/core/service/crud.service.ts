import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../../todo-list/model/task';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  
  apiUrl!: string;

  constructor(private http: HttpClient) {
    this.apiUrl = "http://localhost:3000/tasks"
   }

   getTasks() : Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
   }

   addTask(task: Task) : Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
   }

  //  delTask(task: Task) : Observable<Task> {
  //   return this.http.delete<Task>(this.apiUrl+'/'+task.id);
  //  }

  //  editTask(task: Task) : Observable<Task> {
  //   return this.http.put<Task>(this.apiUrl+'/'+task.id, task);
  //  }
}
