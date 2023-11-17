import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { doc, setDoc, getDoc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  //"https://13.209.7.147/getOpenAI"//"https://middleware-express-1414c4452662.herokuapp.com/getOpenAI"//"https://expressmiddleware.web.app/getOpenAI";//"http://127.0.0.1:5000/getOpenAI" //"https://api.openai.com/v1/chat/completions";
  private apiUrl = "https://13.209.7.147/chatApi"

  constructor(
    private http: HttpClient, 
    private storeService: FirestoreService){}

  ngOnInit(){
    console.log("oninit chat service")
  }
  // post message to middle ware
  sentMessage(chat_history: any[]) {
    const header = new HttpHeaders({
      "Content-Type": 'application/json',
    })

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: chat_history,
    };

    return this.http.post(this.apiUrl, requestData, { headers: header });
  }

  // store message to firebase (max 1 update / sec for doc)
  async saveChat(chat_ID: string, chat_history: any[]): Promise<string>{
    let doc_Id: string = "";

    // for new chat
    if (chat_ID == ""){
      // save chat in new doc and return doc id
      doc_Id = await this.storeService.addDocInColl("Apps/chatApp/ChatData", chat_history);
    } else{ // for exsited chat 
      try{
        // update chat history
        const chatPath = "Apps/chatApp/ChatData/" + chat_ID;
        const newChat = {doc_content: chat_history};
        await this.storeService.addMapInDoc(chatPath, newChat);
        doc_Id = chat_ID;
      } catch (e) {
        console.error("Error chat history: ", e);
      }
    }

    // update chatList
    if (doc_Id != ""){
      const chatInfo = {[doc_Id]: {"title": chat_history[0].content}};
      await this.storeService.addMapAndTimeInDoc("Apps/chatApp", chatInfo)
    }

    return doc_Id;
  }

  // Retrieve chat history from database
  async retrieveChatHistory(chat_id: string):Promise<any[]>{

    // .form doc path bsae on given document ID
    const docPath = "/Apps/chatApp/ChatData/" + chat_id;

    // .retrieve doc from database
    let do_cdata = await this.storeService.retrieveDocDate(docPath);

    // .parase doc and assign to chat_history
    let chat_history: any[] = [];

    if (do_cdata != null) {
      do_cdata['doc_content'].forEach((chat: any) => {
        chat_history.push(chat);
      });
    }

    return chat_history;
  }

  // Retrieve user's chat list
   async retrieveChatList():Promise<any[]>{

    // .form path
    const docPath = "/Apps/chatApp";

    // .retrieve doc
    let doc_data = await this.storeService.retrieveDocDate(docPath);

    // .parse doc to chat list
    let chat_list: any[] = [];

    if (doc_data != null) {
      Object.entries(doc_data).forEach((chatInfo: any[]) => {
       chat_list.push({ id: chatInfo[0], title: chatInfo[1].title, timeStamp: chatInfo[1].timestamp});
      });
    }

    return chat_list;
  }

  // Remove a chat history
  async removeChatHistory(chat_id: string){

    // .form doc path bsae on given document ID
    const docPath = "/Apps/chatApp/ChatData/" + chat_id;

    // .remove doc from database
    await this.storeService.removeDocDate(docPath).then(async()=>{

      // .form field path
      const fieldPath = "/Apps/chatApp/";

      // .delete related chat in chat list
      await this.storeService.deleteField(fieldPath, chat_id);
    })

  }

}