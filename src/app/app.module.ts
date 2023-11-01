import { HttpClientModule } from '@angular/common/http'

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CarsComponent } from './cars/cars.component';

import { PriceWatchComponent } from './price-watch/price-watch.component';
import { Reconstruct3dComponent } from './reconstruct3d/reconstruct3d.component';
import { MindMapComponent } from './mind-map/mind-map.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { EditableModule } from '@ngneat/edit-in-place';
import { ReactiveFormsModule} from '@angular/forms';
import { CoreModule } from './core/core.module';
import { BotComponent } from './bot/bot.component';
//import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    CarsComponent,
    PriceWatchComponent,
    Reconstruct3dComponent,
    MindMapComponent,
    ToDoListComponent,
    AppComponent,
    BotComponent,
    //LoginComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    EditableModule,
    EditableModule,
    ReactiveFormsModule,
    CoreModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
