import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, onIdTokenChanged } from 'firebase/auth'
import * as firebaseAuth from 'firebase/auth';
import { OnInit } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService implements OnInit {
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
  
  userID!: string | null;

  ngOnInit(){
    console.log("ngOnInit: auth service");
    // subscribe to login state
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userID = user.uid;
      } else {
        this.userID = null;
      }
    });
  }

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

  // get current user id
  async checkUserId(): Promise<string | null> {
    console.log("auth service: geting user id")
    
    await onIdTokenChanged(this.auth, (user) => {
      if (user) {
        console.log("auth service: onIdTokenChanged")
        this.userID = user.uid;
        console.log("auth service: " + this.userID);

      } else {
        console.log("auth service: onIdTokenChanged null")
        this.userID = null;
      }
    });

    console.log("auth service: id " + this.userID);
    return this.userID;
  }

  // verify user id
  async getUserID(){
    console.log("auth service: geting user id")
    const auth = await getAuth();
    const user = await auth.currentUser;

    if (user) {
      const uid = user.uid;
      console.log("auth service: " + uid);
      return uid;
    } else {
      return null;
    }
  }
}