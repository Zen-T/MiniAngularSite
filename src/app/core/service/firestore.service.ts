import { Injectable } from '@angular/core';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { AuthFirebaseService } from './auth-firebase.service';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { OnInit } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit{
  constructor(private authService: AuthFirebaseService) {}

  ngOnInit(){
    console.log('ngoninit firestore service')
  }

  // connect firebase Auth with a firebase App
  db = getFirestore(this.authService.app);
  
  // !(doc_content need to clarify?)! add an Doc to an Coll, return Doc Id if success, null if error
  async addDocInColl(collPath: string, doc_content: any[]): Promise<string>{
    let doc_Id: string = "";

    // get user ID
    const userID = await this.authService.getUserID();

    // add data
    if (userID != null){
      try {
        // add doc to a collection with auto gen doc id
        const collRef = collection(this.db, "Users", userID, collPath);
        const docRef = await addDoc(collRef, {doc_content});

        // log doc id
        doc_Id = docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    } else{
      console.error("Can not add doc to coll: No user logged in")
    }

    return doc_Id;
  }

  // add/update Map to an Doc
  async addMapInDoc(docPath: string, map: {}): Promise<boolean>{
    let suc = false;

    // get user ID
    const userID = await this.authService.getUserID();

    // add Map
    if (userID != null){
      if(Object.keys(map).length != 0)
      {
        try {
          // add map to a doc
          const docRef = doc(this.db, "Users", userID, docPath);
          await updateDoc(docRef, map); // new data merged into the existing document
          suc = true;
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        console.error("not key exsits in map")
      }
    } else{
      console.error("Can not add map to doc: No user logged in")
    }

    return suc;
  }

  // merge Map to an Doc with time stamp
  async addMapAndTimeInDoc(docPath: string, map: {}): Promise<string>{
    let doc_Id: string = "";

    // get user ID
    const userID = await this.authService.getUserID();

    // add Map
    if (userID != null){
      if(Object.keys(map).length != 0)
      {
        try {
          // add map to a doc
          const docRef = doc(this.db, "Users", userID, docPath);
          await setDoc(docRef, map, { merge: true }); // new data merged into the existing document

          // add server time stamp inside map's first key
          const timePath = Object.keys(map)[0] + ".timestamp";
          await updateDoc(docRef, {[timePath]: serverTimestamp()});
          
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        console.error("Not key exsits in map")
      }
    } else{
      console.error("Can not add map to doc: No user logged in")
    }

    return doc_Id;
  }

  // Retrieve doc data
  async retrieveDocDate(docPath: string): Promise<any>{
    let doc_data = null;

    // get user ID
    const userID = await this.authService.getUserID();

    // if user exsit
    if (userID != null){
      // qurey
      const docRef = doc(this.db, "Users", userID, docPath);
      const docSnap = await getDoc(docRef);

      // store doc content
      if (docSnap.exists()) {
        doc_data = docSnap.data();
      } else {
        console.log("No such doc: "+ docPath);
      };
    } else{
      console.log("Can not retrieve doc: No user logged in");
    }

    return doc_data;
  }


  // Remove doc
}
