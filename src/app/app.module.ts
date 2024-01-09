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
import { ReactiveFormsModule} from '@angular/forms';
import { CoreModule } from './core/core.module';
import { BotComponent } from './bot/bot.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TodoListModule } from './todo-list/todo-list.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    CarsComponent,
    PriceWatchComponent,
    Reconstruct3dComponent,
    MindMapComponent,
    BotComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CoreModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    TodoListModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
