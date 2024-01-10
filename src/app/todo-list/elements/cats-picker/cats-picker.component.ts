import { Component, OnInit, Output, EventEmitter, Renderer2, ElementRef, Inject } from '@angular/core';
import { TodoListService } from 'src/app/core/service/todo-list.service';

import { AuthFirebaseService } from 'src/app/core/service/auth-firebase.service';
import { onIdTokenChanged } from 'firebase/auth';
import { FirestoreService } from 'src/app/core/service/firestore.service';
import { doc, onSnapshot } from 'firebase/firestore';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscribable } from 'rxjs';

export interface DialogData {
  title: string;
  sub_title: string;
  content: string;
  buttons: {name:string, color:string}[];
  key: string;
}

@Component({
  selector: 'app-cats-picker',
  template: `
    <link rel="stylesheet" href="cats-picker.component.css">
    
    <!-- app container -->
    <div class="app-container">
      <!-- add cat container -->
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
      <mat-chip-listbox class="cats-list mat-mdc-chip-set-stacked">
        <div *ngFor="let cat of catsArr" class="cat-item">
          <mat-chip-option [selected]="selected_cat===cat.name" *ngIf="editing_cat_name !== cat.name" class="cat-button" id="cat-button-{{cat.name}}" (selectionChange)="selectCat($event)">
            <span class="cat-name">{{cat.name}}</span>
            <!-- edit cat name icon -->
            <button *ngIf="editing_cat_name === ''" class="edit-cat-name-icon" (click)="startEditCatName(cat.name)" matChipRemove>
              <img src="assets/icon/pen-to-square-regular.svg">
            </button>
            <!-- del cat icon -->
            <button *ngIf="editing_cat_name === ''" class="del-cat-icon" (click)="removeCat(cat.name)" matChipTrailingIcon>
              <img src="assets/icon/trash-can-regular.svg">
            </button>
          </mat-chip-option>
          <!-- edit cat name input box -->
          <input
            *ngIf="editing_cat_name === cat.name"
            class="cat-name-edit-input"
            id="cat-name-edit-input-{{cat.name}}"
            type="text"
            value="{{cat.name}}"
            [(ngModel)]="updated_cat_name"
            (keyup.enter)="updateCatName(cat.name, updated_cat_name)"
            appClickedOutside
            (clickedOutside)="updateCatName(cat.name, updated_cat_name)"
            (keyup.escape)="cancelEditCatName(cat.name)"
          />
        </div>
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
  selected_cat: string = "";
  selected_state: boolean | string = false;
  updated_cat_name: string = "";
  editing_cat_name: string = "";

  constructor(
    private taskService: TodoListService,
    private authService: AuthFirebaseService,
    private storeService: FirestoreService,
    private render: Renderer2,
    private el: ElementRef,
    public dialog: MatDialog
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

    // hard code to make cat item list width 100% (css not work for some reason)
    this.el.nativeElement.querySelectorAll(".mdc-evolution-chip-set__chips").forEach((element: ElementRef)=>{
      this.render.setStyle(element, "width", "100%")
    })
  }

  // add cat
  async addCat(){
    if(this.new_cat_name != ""){
      this.taskService.addCat(this.new_cat_name);
      this.new_cat_name = "";
      this.ngOnInit();
    }
  }

  // start edit Cat Name
  startEditCatName(cat_name: string){
    // show input box & hide cat chip
    this.editing_cat_name = cat_name;

    // assign var for new name
    this.updated_cat_name = cat_name;
  }

  // end edit Cat Name
  cancelEditCatName(cat_name: string){
    // show input box & hide cat chip
    this.editing_cat_name = "";

    // assign var for new name
    this.updated_cat_name = "";
  }

  // update cat name
  updateCatName(origin_cat_name: string, updated_cat_name: string){
    let nameExsits:boolean = false;

    // check if new name is blank
    if(updated_cat_name != ""){

      // check if new_name
      if(updated_cat_name != origin_cat_name){

        // check if new cat name already exits
        try {
          this.catsArr.forEach(cat =>{
            if(cat.name == updated_cat_name){
              nameExsits = true;
              throw nameExsits;
            }
          })}catch (e) {console.log(e)}

        if(nameExsits){
          console.log("name already exsit", origin_cat_name, updated_cat_name)
          // pop up to ask if merge tasks under this cat
          // set up pop up info
          let diaLogData: DialogData = {
            title: 'Category "'+updated_cat_name+'" already exists',
            sub_title:'',
            content: 'Do you want to merge all tasks from category "'+origin_cat_name+'" to category "'+updated_cat_name+'"?',
            buttons: [{name:"Merge all tasks", color:"red"}],
            key: ''
          };
          // pop up to comfirm if del all tasks under this cat
          const dialogRef = this.dialog.open(WarningDialog,{data: diaLogData});
          dialogRef.afterClosed().subscribe(result => {
            if(result == "Merge all tasks"){
              console.log("mergering", origin_cat_name, updated_cat_name)
              // add new name to database and change all tasks under origin cat
              console.log("all task", origin_cat_name, updated_cat_name)
              this.taskService.updateCatName(origin_cat_name, updated_cat_name);
              console.log(origin_cat_name, updated_cat_name)

              // update selected cat to update tasks viewer
              console.log("done", origin_cat_name, updated_cat_name)
              this.selected_cat = updated_cat_name;
              this.cat_selection.emit(this.selected_cat);
            }
          });
        }else{
          // add new name to database and change all tasks under origin cat
          this.taskService.updateCatName(origin_cat_name, updated_cat_name);

          // update selected cat to update tasks viewer
          this.selected_cat = updated_cat_name;
          this.cat_selection.emit(this.selected_cat);
        }
      }
    }

    // reset var
    this.updated_cat_name = "";
    this.editing_cat_name = "";
  }

  // remove cat
  removeCat(cat_name: string){
    // set up pop up info
    let diaLogData: DialogData = {
      title: 'Delete this category?',
      sub_title:'Doing so will also permanently delete ALL tasks under this category',
      content: '',
      buttons: [],
      key: cat_name
    };
    // pop up to comfirm if del all tasks under this cat
    const dialogRef = this.dialog.open(WarningDialog,{data: diaLogData});
    dialogRef.afterClosed().subscribe(result => {
      if(result == cat_name){
        // comfirmed to remove cat
        this.taskService.removeCatAndItsTasks(cat_name);
      }
    });
  }

  // get cats list
  async getCatsList(){
    this.catsArr = await this.taskService.getCatsList();
  }

  // output selected cat 
  selectCat(catChange: MatChipSelectionChange){
    // selected chip
    if(catChange.selected){
      const cat_name = catChange.source.value;
      this.selected_cat = cat_name;
    }
    // unselected chip
    else{
      this.selected_cat = "";
    }

  // output selected cat 
  this.cat_selection.emit(this.selected_cat);
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

  // open dialog 
  openDialog(dialogData: DialogData) {
    const dialogRef = this.dialog.open(WarningDialog,{data: dialogData});
    dialogRef.afterClosed().subscribe(result => {console.log('The dialog was closed', result);});
  }
}






// warning-dialog Component
@Component({
  selector: 'warning-dialog',
  template: `
    <link rel="stylesheet" href="warning-dialog-component.css">

    <header class="dialog-header">
      <h1 class="dialog-title" mat-dialog-title>
        <i class="material-icons">warning</i>
        {{data.title}}
      </h1>
      <p class="dialog-sub-title">
        {{data.sub_title}}
      </p>
    </header>
    <section class="dialog-body">
      <div class="dialog-content" mat-dialog-content>{{data.content}}</div>
      <div class="dialog-type-key" *ngIf="data.key!=''" mat-dialog-content>Proceed to delete by typing: <strong>{{data.key}}</strong></div>
      <div class="dialog-type-key-inpu-container"><input class="dialog-type-key-inpu" *ngIf="data.key!=''" matInput [(ngModel)]="userKeyInput" placeholder="{{data.key}}"></div>
    </section>
    <div class="dialog-action" mat-dialog-actions align="end">
      <button *ngFor="let button of data.buttons" mat-button [mat-dialog-close]="button.name" cdkFocusInitial style="background-color: {{button.color}}">{{button.name}}</button>
      <button *ngIf="data.key" class="deleteDisable" [ngClass]="{'deleteEnable': data.key===userKeyInput}" mat-button [mat-dialog-close]="data.key" cdkFocusInitial [disabled]="data.key!==userKeyInput" style="">Delete</button>
      <button mat-button (click)="onNoClick()">Cancel</button>
    </div>

  `,
})
export class WarningDialog implements OnInit{
  userKeyInput!: string;

  ngOnInit(){
    // make dialog round border
    document.querySelectorAll('.mdc-dialog__surface').forEach((element)=>{
      this.render.setStyle(element, "border-radius", "39px");
    })
  }

  constructor(
    public dialogRef: MatDialogRef<WarningDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private render: Renderer2,
    ) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}