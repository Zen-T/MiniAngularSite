// this service provide function to read/write to the firebase database

import { Injectable, OnInit } from "@angular/core";
import { AuthFirebaseService } from './auth-firebase.service';
import { doc, collection, query, where, orderBy, QueryConstraint, deleteDoc, getFirestore, WhereFilterOp } from "firebase/firestore";
import { setDoc, addDoc, getDocs, getDoc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { getAuth, onIdTokenChanged } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService{

  userID: string | null = null;

  constructor(private authService: AuthFirebaseService) {
    // subscribe to login state
    onIdTokenChanged(this.authService.auth, (user) => {
      // user logged in
      if (user) {
        this.userID = user.uid;
      }
      // no user logged in
      else {
        this.userID = null;
      }
    });
  }
  
  // connect firebase Auth with a firebase App
  db = getFirestore(this.authService.app);

  // add an Doc to an Coll, return Doc Id if success, null if error
  async addDocInColl(collPath: string, doc_content: JSON): Promise<string>{
    let doc_Id: string = "";

    // add data
    if (this.userID != null){
      try {
        // add doc to a collection with auto gen doc id
        const collRef = collection(this.db, "Users", this.userID, collPath);
        const docRef = await addDoc(collRef, JSON.parse(JSON.stringify(doc_content)));

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

  // add/overwrite Map to an Doc
  async addMapInDoc(docPath: string, map: {}): Promise<boolean>{
    let suc = false;

    // add Map
    if (this.userID != null){
      if(Object.keys(map).length != 0)
      {
        try {
          // add map to a doc
          const docRef = doc(this.db, "Users", this.userID, docPath);
          await setDoc(docRef, map, { merge: true });  // new data merged into the existing document
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

    // add Map
    if (this.userID != null){
      if(Object.keys(map).length != 0)
      {
        try {
          // add map to a doc
          const docRef = doc(this.db, "Users", this.userID, docPath);
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
  async retrieveDocs(collPath: string, queryConstraints?: QueryConstraint[]): Promise<any[]>{
    let docs_data: any[] = [];
    
    // if user exsit
    if (this.userID != null){
      // qurey
      const collRef = collection(this.db, "Users", this.userID, collPath);
      let q = query(collRef);
      
      // if queryConstraints exsits
      if (typeof queryConstraints !== 'undefined'){
        q = query(collRef, ...queryConstraints);
      }

      // get doc
      const querySnapshot = await getDocs(q);

      // parse and push to output var
      querySnapshot.forEach((doc) => {
        docs_data.push({[doc.id]: doc.data()});
      })
    }

    return docs_data;
  }

  // Retrieve doc data
  async retrieveDocDate(docPath: string): Promise<any>{
    let doc_data = null;

    // if user exsit
    if (this.userID != null){
      // qurey
      const docRef = doc(this.db, "Users", this.userID, docPath);
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
  async removeDoc(docPath: string){
    // if user exsit
    if (this.userID != null){

      // delete doc
      const docRef = doc(this.db, "Users", this.userID, docPath);
      await deleteDoc(docRef);

    } else{
      console.log("Can not remove doc: No user logged in");
    }
  }

  // Delete field
  async deleteField(docPath: string, field_name: string){

    // if user exsit
    if (this.userID != null){

      // .delete field
      const docRef = doc(this.db, "Users", this.userID, docPath);
      await updateDoc(docRef, {[field_name]: deleteField()});

    } else{
      console.log("Can not delete field: No user logged in");
    }
  }
}