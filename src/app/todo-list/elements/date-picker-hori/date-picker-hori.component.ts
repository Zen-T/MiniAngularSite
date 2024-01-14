import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker-hori',
  template: `
    <link rel="stylesheet" href="date-picker-hori.component.css">
    
    <div class="date-input">
      <div class="clear-date">
        <img *ngIf="selected_date" class="clear-date-button" src="assets/icon/circle-xmark-regular.svg" (click)="clearPickedDate()">
      </div>
      <mat-form-field subscriptSizing="dynamic">
        <mat-label>Choose a date</mat-label> 
        <input matInput [matDatepicker]="picker" [value]='selected_date' (dateChange)="selectDate($event.value)">
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

    </div>

  `,
  styles: [
  ]
})
export class DatePickerHoriComponent implements OnInit{
  @Output() date_selection = new EventEmitter<Date | null>(true);
  selected_date: Date | null = null;

  ngOnInit(){
    this.selected_date = null;
    this.date_selection.emit(this.selected_date);

  }

  selectDate(selected_date: Date | null){
    this.selected_date = selected_date;
    this.date_selection.emit(selected_date);
  }

  clearPickedDate(){
    this.selected_date = null;
    this.date_selection.emit(this.selected_date);
  }
}
