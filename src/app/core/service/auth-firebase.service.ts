import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'
import * as firebaseAuth from 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  // connect firebase Auth with a firebase App
  firebaseConfig = {
    apiKey: "AIzaSyASITCJVAu03AZXoBupZ9EH4uU3iTKjuDU",
    authDomain: "miniauglarsite.firebaseapp.com",
    projectId: "miniauglarsite",
    storageBucket: "miniauglarsite.appspot.com",
    messagingSenderId: "190759352038",
    appId: "1:190759352038:web:cdad1e22de4e1b2e7aad27",
    measurementId: "G-6RGX3FRPWH"
  };
  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  
  // user sign up
  async userSignUp(email:string, password:string){
    await firebaseAuth.createUserWithEmailAndPassword(this.auth, email, password).then(cred => {
      console.log("user sign up: ");
      console.log(cred);
    });
  }

  // user log in
  async userLogIn(email:string, password:string){
    await firebaseAuth.signInWithEmailAndPassword(this.auth, email, password).then(cred => {
      console.log("user log in: ");
      console.log(cred);
    });
  }

  // user log out
  async userLogOut(){
    await firebaseAuth.signOut(this.auth).then(()=>{
      console.log("user log out")
    });
  }

  // verify user id
  async getUserID(): Promise<string|null>{
    const user = await getAuth().currentUser;

    if (user) {
      return user.uid;
    } else {
      return null;
    }
  }
}