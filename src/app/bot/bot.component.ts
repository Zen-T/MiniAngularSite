import { Component } from '@angular/core';
import { ChatService } from '../core/service/chat.service';
import { AuthFirebaseService } from '../core/service/auth-firebase.service';
import { OnInit } from "@angular/core";
import { onIdTokenChanged } from 'firebase/auth'
import { doc, onSnapshot } from "firebase/firestore";
import { FirestoreService } from '../core/service/firestore.service';

@Component({
  selector: 'app-bot',
  template: `
  <link rel="stylesheet" href="bot.component.css">

  <div class="chat-container">

    <!-- chat list -->
    <div class="chat-list" *ngIf="chat_lists">
      <div>
        <p (click)="startNewChat()" class="addNew"> + 新话题 </p>
      </div>
      <div *ngFor="let chatInfo of chat_lists">
        <p (click)="retrieveChat(chatInfo.id)" *ngIf="chatInfo.id !== chat_ID" class="title">{{ chatInfo.title }}</p>
        <p (click)="retrieveChat(chatInfo.id)" *ngIf="chatInfo.id === chat_ID" class="selected">{{ chatInfo.title }}</p>
      </div>
    </div>

    <!-- current chat -->
    <div class="current-chat">
      <!-- warning message -->
      <div class="message is-danger error-chat" *ngIf="errorMessage">
        <div class="message-header">
          <p>发生错误</p>
          <button class="delete" aria-label="delete" (click)="clearErrorMess()"></button>
        </div>
        <div class="message-body">
          {{ errorMessage | json }}
        </div>
      </div>

      <!-- chat history -->
      <div class="chat-history">
        <div *ngFor="let message of chat_history">
          <p *ngIf="message.role === 'user'" class="user">你: {{ message.content }}</p>
          <p *ngIf="message.role === 'assistant'" class="bot">GPT: {{ message.content }}</p>
        </div>
      </div>

      <!-- chat input -->
      <form class="message-input-container" (ngSubmit)="sentChat()" #chatBox='ngForm'>
        <div class="input-box">
          <input 
            [(ngModel)]="chat_input"
            #chat_in = "ngModel"
            name="chat_input" 
            class="box-message input is-large"
            type="text" 
            placeholder="输入信息"
            required>
        </div>

        <button 
          class="sent-button"
          type="submit"
          class="bottom-sent-message button is-large is-warning" 
          [disabled]="chatBox.invalid || wait"
          >
          发送
        </button>
      </form>
    </div>
    
  </div>

  `,
  styles: [
  ]
})

export class BotComponent implements OnInit{
  chat_input!: string;
  chat_history!: any[];
  chat_ID!: string;
  chat_lists!: any[] | null;

  wait!: boolean;
  errorMessage!: any;
  
  // Construct service
  constructor(
    private chatService: ChatService,
    private authService: AuthFirebaseService,
    private storeService: FirestoreService){}

  // Init Component 
  async ngOnInit(){
    // init local var
    this.chat_input = "";
    this.chat_history = [];
    this.chat_ID = "";
    this.chat_lists = null;
    this.wait = false;
    this.errorMessage = null;

    // subscribe to login state
    onIdTokenChanged(this.authService.auth, (user) => {
      // user logged in
      if (user) {
        // subscribe database chat list
        const docRef = doc(this.storeService.db, "Users", user.uid, "/Apps/chatApp")
        onSnapshot(docRef, (doc) => {
          // load chat list
          this.retrieveChatList();
      });} 
      // no user logged in
      else {
        // empty local var
        this.chat_history = [];
        this.chat_ID = "";
        this.chat_lists = null;
        this.wait = false;
      }
    });
  }
  
  // Clear pop up error message
  clearErrorMess(){
    this.errorMessage = false;
  }

  // Sent user chat to chatbot API & Save chat history
  async sentChat(){
    // .read chat_input box
    const message = this.chat_input;

    // .push chat_input to local var chat_history
    this.chat_history.push({ role: 'user', content: message });
    this.chat_input = "";

    // . wait for bot respond ()
    this.wait = true;

    // sent new message to server
    this.chatService.sentMessage(this.chat_history)
    .subscribe(
      async (response: any) => {
        // push respond to local chat_history var
        this.chat_history.push({ role: 'assistant', content: response.choices[0].message.content });
        // save chat history to database
        this.chat_ID = await this.chatService.saveChat(this.chat_ID, this.chat_history);
        // release wait
        this.wait = false;
      },
      (error: any) => {
        // show if error
        this.errorMessage = error;
      });
  }

  // Retrieve chat history
  async retrieveChat(chat_id: string){
    // retrieve chat history bsae on given document ID
    this.chat_history = await this.chatService.retrieveChatHistory(chat_id);
    
    // assign document id for updating new chat
    this.chat_ID = chat_id;
  }

  // retrieve chat list
  async retrieveChatList(){
    this.chat_lists = await this.chatService.retrieveChatList();
  }

  // retrieve chat list
  async startNewChat(){
    // init local var
    this.chat_history = [];
    this.chat_ID = "";
    this.wait = false;
    this.retrieveChatList();
  }

}