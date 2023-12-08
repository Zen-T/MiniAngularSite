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
  @Output() date_sele_map = new EventEmitter<object>();
  
  selectDate(id: number){
    // form date selection constraint
    const constraint = {key:"day", opt:"==", val: id};
    
    // output datte selection to parent component
    this.date_sele_map.emit(constraint);
  }

  deselectDate(){
    // form date selection constraint
    const constraint = {};

    // output datte selection to parent component
    this.date_sele_map.emit(constraint);
  }
}
