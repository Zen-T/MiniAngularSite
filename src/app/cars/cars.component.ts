import { Component } from '@angular/core';
import { CarsServiceService } from '../core/service/cars-service.service';

@Component({
  selector: 'app-cars',
  template: `

  <section class="section">
  <div class="container">
    <form (ngSubmit)="submitForm()" #carForm='ngForm'>
      <!-- Api Key Input -->
      <div class="field">
        <label class="label">Api Key</label>
        <input 
          type="text" 
          class="input"
          name="apiKey"
          [(ngModel)]="apiKey"
          #apiKeyInput = "ngModel"
          required>
      </div>
      <!-- Car maker Input -->
      <div class="field">
        <label class="label">Brand</label>
        <input 
          type="text" 
          class="input"
          name="car_brand"
          [(ngModel)]="car_brand"
          #carBrandInput = "ngModel"
          required>
      </div>
      <!-- Api Submit Button -->
      <button 
        type="submit"
        class="button is-large is-warning"
        [disabled]="carForm.invalid">
        Submit
      </button>
    </form>
  </div>

  </section>
  
  <section class="section">
    <div class="container">
      <div class="columns is-multiline" *ngIf="cars" >
        <div class="column is-4" *ngFor="let car of cars | async">
          <div class="card">
            <div class="card-content">
                {{ car.year }}
                {{ car.make }}
                {{ car.class }}
                {{ car.model }}
                {{ car.transmission }}
                {{ car.cylinders }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  styles: [
  ]
})
export class CarsComponent {
  apiKey: string = "7ULNQb5N8PO5XoOzMH691QKdISojpNYwhdbABE5c";
  car_brand: string = "subaru";

  cars: any;

  constructor(private carSevice: CarsServiceService) {}

  ngOnInit(){}

  submitForm() {
    this.cars = this.carSevice.getCars(this.apiKey, this.car_brand);
  }
}
