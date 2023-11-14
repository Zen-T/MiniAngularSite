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
import { LoginComponent } from './login/login.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


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
    LoginComponent,    
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
    // provideFirebaseApp(() => initializeApp({"projectId":"miniauglarsite","appId":"1:190759352038:web:014b45b3a89fcc6d7aad27","storageBucket":"miniauglarsite.appspot.com","apiKey":"AIzaSyASITCJVAu03AZXoBupZ9EH4uU3iTKjuDU","authDomain":"miniauglarsite.firebaseapp.com","messagingSenderId":"190759352038","measurementId":"G-1RNFPJVCHQ"})),
    // provideAuth(() => getAuth()),
    // provideFirestore(() => getFirestore()),
    // AngularFireModule.initializeApp({
    //   apiKey: "AIzaSyASITCJVAu03AZXoBupZ9EH4uU3iTKjuDU",
    //   authDomain: "miniauglarsite.firebaseapp.com",
    //   projectId: "miniauglarsite",
    //   storageBucket: "miniauglarsite.appspot.com",
    //   messagingSenderId: "190759352038",
    //   appId: "1:190759352038:web:7edf1ec4be1b95467aad27",
    //   measurementId: "G-X19GYVGG7H"
    // }),
    // AngularFireAuthModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
