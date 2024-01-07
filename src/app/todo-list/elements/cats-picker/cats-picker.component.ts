import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TodoListService } from 'src/app/core/service/todo-list.service';

import { AuthFirebaseService } from 'src/app/core/service/auth-firebase.service';
import { onIdTokenChanged } from 'firebase/auth';
import { FirestoreService } from 'src/app/core/service/firestore.service';
import { QueryConstraint, doc, onSnapshot } from 'firebase/firestore';
import { MatChipSelectionChange } from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-cats-picker',
  template: `
    <link rel="stylesheet" href="cats-picker.component.css">
    
    <!-- app container -->
    <div class="app-container">

      <!-- cat add container -->
      <div class="add-cat-container">
        <!-- new cat input box -->
        <div class="add-cat-name-box">
          <input 
            class="input" 
            placeholder="New Cat Name" 
            type="text"
            name="newCatName"
            [(ngModel)]="new_cat_name"
            #newTaskInput = "ngModel"
            (keyup.enter)="addCat()"
            required
          >
        </div>
        <!-- add button -->
        <div class="add-cat-button">
          <button 
            class="button hero is-primary is-bold"
            type="submit"
            [disabled]="newTaskInput.invalid"
            (click)="addCat()">
            ADD
          </button>
        </div>
      </div>

      <!-- cats selector -->
      <mat-chip-listbox class="cats-selector mat-mdc-chip-set-stacked" aria-label="Color selection">
        <mat-chip-option class="cat-button" *ngFor="let cat of catsArr" (selectionChange)="selectCat($event)">{{cat.name}}</mat-chip-option>
      </mat-chip-listbox>    

      <!-- tasks state selector -->
      <div class="state-selector">
        <mat-form-field subscriptSizing="dynamic" style="width: 100%;">
          <mat-label>show tasks</mat-label>
          <mat-select [(value)]="selected_state" (selectionChange)="selectState(selected_state)">
            <mat-option value="">All</mat-option>
            <mat-option [value]="false">To Do</mat-option>
            <mat-option [value]="true">Done</mat-option>
          </mat-select>
        </mat-form-field>
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
  async addCat(){
    if(this.new_cat_name != ""){
      await this.taskService.addCat(this.new_cat_name);
      this.new_cat_name = "";
      this.ngOnInit();
    }
  }

  // remove cat

  // update cat

  // get cats list
  async getCatsList(){
    this.catsArr = await this.taskService.getCatsList();
  }

  // output selected cat 
  selectCat(catChange: MatChipSelectionChange){
    // selected chip
    if(catChange.selected){
      const cat_name = catChange.source.value;
      this.cat_selection.emit(cat_name);
    }
    // unselected chip
    else{
      this.cat_selection.emit("");
    }
  }

  // output selected state
  selectState(selected_state: boolean | string){
    if(typeof selected_state == "boolean"){
      this.state_selection.emit(selected_state);
    }
    else{
      this.state_selection.emit(null);
    }
  }
}
