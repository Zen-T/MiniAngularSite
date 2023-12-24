import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker-hori',
  template: `
    <div class="function testing">
      <button id=1 (click)="selectDate(1)">1</button>
      <button (click)="deselectDate()">deselectDate</button>
    </div>
  `,
  styles: [
  ]
})
export class DatePickerHoriComponent {
  @Output() date_selection = new EventEmitter<number>();
  
  selectDate(id: number){
    // output datte selection to parent component
    this.date_selection.emit(id);
  }

  deselectDate(){
    // output datte selection to parent component
    this.date_selection.emit(0);
  }
}
