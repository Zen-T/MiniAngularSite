import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TodoListService } from 'src/app/core/service/todo-list.service';

import { AuthFirebaseService } from 'src/app/core/service/auth-firebase.service';
import { onIdTokenChanged } from 'firebase/auth';
import { FirestoreService } from 'src/app/core/service/firestore.service';
import { QueryConstraint, doc, onSnapshot } from 'firebase/firestore';


@Component({
  selector: 'app-cats-picker',
  template: `
    <link rel="stylesheet" href="cats-picker.component.css">

    <!-- tasks state selector -->
    <mat-form-field style="width: 100%;">
      <mat-label>show task</mat-label>
      <mat-select [(value)]="selected_state" (selectionChange)="selectState(selected_state)">
        <mat-option value="null">All</mat-option>
        <mat-option [value]="false">To Do</mat-option>
        <mat-option [value]="true">Done</mat-option>
      </mat-select>
    </mat-form-field>

    <!-- app container -->
    <div class="cats-list-container">
      <!-- cat add container -->
      <div class="add-cat-container">
          <input [(ngModel)]="new_cat_name" type="text">
          <button (click)="addCat(new_cat_name)">add cat</button>
      </div>
      <!-- cat viewer container -->
      <div class="cats-viewer">
        <!-- cat list -->
        <ul class="cats-list" *ngIf="catsArr!==[]">
          <!-- Deselect cat -->
          <button (click)="deselectCat()">deselect</button>
          <!-- cat item -->
          <div class="cat-item" *ngFor="let cat of catsArr" id="{{cat.name}}">
            <!-- cat-name -->
            <li class="cat-name" (click)="selectCat(cat.name)">
              {{ cat.name }}
            </li>
          </div>
        </ul>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class CatsPickerComponent implements OnInit{
  @Output() cat_selection =  new EventEmitter<string>();
  @Output() state_selection =  new EventEmitter<boolean | null>();

  catsArr: any[] = [];
  new_cat_name: string = "";
  selected_state: boolean | string = false;

  constructor(
    private taskService: TodoListService,
    private authService: AuthFirebaseService,
    private storeService: FirestoreService
  ){}

  async ngOnInit(){
    // subscribe to login state
    onIdTokenChanged(this.authService.auth, async(user) => {
      // user logged in
      if (user) {
        // subscribe database catsList changes
        onSnapshot(doc(this.storeService.db, "Users", user.uid, "/Apps/todoApp/Categories/catsList"), (doc) => {
          // reload cat list
          this.getCatsList();
        });
      }
      // no user logged in
      else {
        // empty local var
        this.catsArr = [];
      }
    }); 

    // emit state selection
    this.selectState(this.selected_state);
  }

  // add cat
  async addCat(cat_name: string){
    await this.taskService.addCat(cat_name);
    this.ngOnInit();
  }

  // remove cat

  // update cat

  // get cats list
  async getCatsList(){
    this.catsArr = await this.taskService.getCatsList();
  }

  // output selected cat 
  async selectCat(cat_name: string){
    this.cat_selection.emit(cat_name);
  }

  // deselect cat
  async deselectCat(){
    // output cat selection to parent component
     this.cat_selection.emit("");
  }

  // output selected state
  async selectState(selected_state: boolean | string){
    if(typeof selected_state == "boolean"){
      this.state_selection.emit(selected_state);
    }
    else{
      this.state_selection.emit(null);
    }
  }
}
