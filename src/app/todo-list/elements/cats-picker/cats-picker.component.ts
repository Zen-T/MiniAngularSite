import { Component, OnInit, Output, EventEmitter, Renderer2, ElementRef, Inject, Input, AfterViewInit } from '@angular/core';
import { TodoListService } from 'src/app/core/service/todo-list.service';

import { MatChipSelectionChange } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

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
        <div *ngFor="let cat_id of Object.keys(catsDict)" class="cat-item">
          <mat-chip-option [selected]="selected_cat === cat_id" *ngIf="editing_cat !== cat_id" id="{{cat_id}}" class="cat-button" (selectionChange)="selectCat($event)">
            <span class="cat-name">{{catsDict[cat_id]}}</span>
            <!-- edit cat name icon -->
            <button *ngIf="editing_cat === ''" class="edit-cat-name-icon" (click)="startEditCatName(cat_id)" matChipRemove>
              <img src="assets/icon/pen-to-square-regular.svg">
            </button>
            <!-- del cat icon -->
            <button *ngIf="editing_cat === ''" class="del-cat-icon" (click)="removeCat(cat_id)" matChipTrailingIcon>
              <img src="assets/icon/trash-can-regular.svg">
            </button>
          </mat-chip-option>
          <!-- edit cat name input box -->
          <input
            *ngIf="editing_cat === cat_id"
            class="cat-name-edit-input"
            id="cat-name-edit-input-{{cat_id}}"
            type="text"
            value="{{catsDict[cat_id]}}"
            [(ngModel)]="updated_cat_name"
            (keyup.enter)="updateCatName(cat_id, updated_cat_name)"
            appClickedOutside
            (clickedOutside)="updateCatName(cat_id, updated_cat_name)"
            (keyup.escape)="cancelEditCatName()"
          />
        </div>
      </mat-chip-listbox>
      
      <!-- tasks state selector -->
      <div class="state-selector">
        <mat-form-field subscriptSizing="dynamic" style="width: 100%;">
          <mat-label>show tasks</mat-label>
          <mat-select [(value)]="selected_state" (selectionChange)="selectState(selected_state)">
            <mat-option value="all">All</mat-option>
            <mat-option value="ongoing">On Going</mat-option>
            <mat-option value="todo">To Do</mat-option>
            <mat-option value="done">Done</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      
    </div>

  `,
  styles: [
  ]
})
export class CatsPickerComponent implements OnInit, AfterViewInit{
  @Output() cat_selection =  new EventEmitter<string>();
  @Output() state_selection =  new EventEmitter<"todo" | "ongoing" | "done" | "all">();
  @Input() catsDict!: { [key: string]: string };

  new_cat_name: string = "";
  selected_cat: string = "";
  selected_state: "todo" | "ongoing" | "done" | "all" = "todo";
  updated_cat_name: string = "";
  editing_cat: string = "";
  Object = Object;

  constructor(
    private taskService: TodoListService,
    private render: Renderer2,
    private el: ElementRef,
    public dialog: MatDialog
  ){}

  ngOnInit(){
    // set selected_cat as first cat to redece loading all tasks
    const cats_id = Object.keys(this.catsDict);
    if (cats_id.length > 0) {
      const firstCatId = cats_id[0];
      this.selected_cat = firstCatId;
    } 

    // emit cat selection when componment created 
    this.cat_selection.emit(this.selected_cat);

    // emit state selection when componment created 
    this.selectState(this.selected_state); 
  }

  ngAfterViewInit(){
    // hard code to make cat item list width 100% (css not work for some reason)
    this.el.nativeElement.querySelectorAll(".mdc-evolution-chip-set__chips").forEach((element: ElementRef)=>{
      this.render.setStyle(element, "width", "100%")
    })
  }

  // add cat
  async addCat(){
    if(this.new_cat_name != ""){
  
      let nameExsits:boolean = false;

      // check if new cat name already exits
      Object.keys(this.catsDict).forEach(cat_id => {
        const cat_name = this.catsDict[cat_id];
        if(cat_name == this.new_cat_name){
          nameExsits = true;
        }
      });

      // add new cat
      if(!nameExsits){
        this.taskService.addCat(this.new_cat_name);
        this.new_cat_name = "";
      }

      // pop up to inform user
      if(nameExsits){
        console.log("cat name already exsit")
        let diaLogData: DialogData = {
          title: 'Category "'+ this.new_cat_name +'" already exists',
          sub_title:'',
          content: 'Please try another cat name',
          buttons: [],
          key: ''
        };
        const dialogRef = this.dialog.open(WarningDialog,{data: diaLogData});
      }
    }
  } 

  // start edit Cat Name
  startEditCatName(cat_id: string){
    // show input box & hide cat chip
    this.editing_cat = cat_id;

    // assign var for new name
    this.updated_cat_name = this.catsDict[cat_id];
  }

  // end edit Cat Name
  cancelEditCatName(){
    // show input box & hide cat chip
    this.editing_cat = "";

    // assign var for new name
    this.updated_cat_name = "";
  }

  // update cat name
  updateCatName(cat_id: string, updated_cat_name: string){
    let nameExsits:boolean | string = false;

    const origin_cat_name = this.catsDict[cat_id]

    // check if new name is blank
    if(updated_cat_name != ""){

      // check if new_name
      if(updated_cat_name != origin_cat_name){

        // check if new cat name already exits
        Object.keys(this.catsDict).forEach(cat_id =>{
          if(this.catsDict[cat_id] == updated_cat_name){
            nameExsits = cat_id;
           }
        })

        if(nameExsits !== false){
          console.log("name already exsit", updated_cat_name)
          // pop up to ask if merge tasks under this cat
          // set up pop up info
          let diaLogData: DialogData = {
            title: 'Category "'+updated_cat_name+'" already exists',
            sub_title:'',
            content: 'Do you want to merge all tasks from category "'+origin_cat_name+'" to category "'+updated_cat_name+'"?',
            buttons: [{name:"Merge all tasks", color:"red"}],
            key: ''
          };
          // pop up to comfirm if Merge all tasks
          const dialogRef = this.dialog.open(WarningDialog,{data: diaLogData});
          dialogRef.afterClosed().subscribe(result => {
            if(result == "Merge all tasks" && typeof(nameExsits) == "string"){
              // add new name to database and change all tasks under origin cat
              console.log("mergering tasks from ", origin_cat_name, " => ", updated_cat_name)
              this.taskService.mergeCats(cat_id, nameExsits);

              // update selected cat to update tasks viewer
              this.selected_cat = nameExsits;
              this.cat_selection.emit(this.selected_cat);
            }
          });
        }else{
          // add new name to database and change all tasks under origin cat
          this.taskService.updateCatName(cat_id, updated_cat_name);

          // update selected cat to update tasks viewer
          this.selected_cat = updated_cat_name;
          this.cat_selection.emit(this.selected_cat);
        }
      }
    }

    // reset var
    this.updated_cat_name = "";
    this.editing_cat = "";
  }

  // remove cat
  removeCat(cat_id: string){
    // get cat name with id
    const cat_name = this.catsDict[cat_id];

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
        this.taskService.removeCatAndItsTasks(cat_id);
      }
    });
  }

  // output selected cat 
  selectCat(catChange: MatChipSelectionChange){

    console.log(catChange)
    // selected chip
    if(catChange.selected){
      const cat_id = catChange.source.id;
      this.selected_cat = cat_id;
    }
    // unselected chip
    else{
      this.selected_cat = "";
    }

  // output selected cat 
  this.cat_selection.emit(this.selected_cat);
}

  // output selected state
  selectState(selected_state: "todo" | "ongoing" | "done" | "all"){
    this.state_selection.emit(selected_state);
    console.log(selected_state);
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
      <div class="dialog-type-key-input-container"><input class="dialog-type-key-input" *ngIf="data.key!=''" matInput [(ngModel)]="userKeyInput" placeholder="{{data.key}}"></div>
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