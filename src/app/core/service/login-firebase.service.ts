import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { Firestore } from '@firebase/firestore/dist/lite';
import * as firebaseui from 'firebaseui';
import * as firebaseAuth from 'firebase/auth';



@Injectable({
  providedIn: 'root'
})
export class LoginFirebaseService {

  constructor() { }

  // connect firebase Auth with a firebase App

  
  
  
  // Get a list of cities from your database
  async getCities(db: Firestore) {
    const citiesCol = collection(db, 'cities');
    const citySnapshot = await getDocs(citiesCol);
    const cityList = citySnapshot.docs.map(doc => doc.data());
    return cityList;
  }

  checkState(){
    const firebaseConfig = {
      apiKey: "AIzaSyASITCJVAu03AZXoBupZ9EH4uU3iTKjuDU",
      authDomain: "miniauglarsite.firebaseapp.com",
      projectId: "miniauglarsite",
      storageBucket: "miniauglarsite.appspot.com",
      messagingSenderId: "190759352038",
      appId: "1:190759352038:web:cdad1e22de4e1b2e7aad27",
      measurementId: "G-6RGX3FRPWH"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const todosCol = collection(db, 'todos');
    onAuthStateChanged (auth, user =>{
      if (user != null) {
        console.log('Logged in!');
      } else {
        console.log('No user');
      }
    });
  }
  db(db: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
}
