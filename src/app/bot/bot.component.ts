import { Component } from '@angular/core';
import { ChatService } from '../core/service/chat.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { empty } from 'rxjs';

@Component({
  selector: 'app-bot',
  template: `
  <link rel="stylesheet" href="bot.component.css">

  <section class="chat-container">
  <!-- chat history -->
  <div class="scroll-container">
  <div *ngFor="let message of chat_history">
      <p *ngIf="message.role === 'user'" class="user">你: {{ message.content }}</p>
      <p *ngIf="message.role === 'assistant'" class="bot">GPT: {{ message.content }}</p>
  </div>
  </div>
  
  <!-- chat input box -->
  <div class="bottom-area-input">
  <form (ngSubmit)="sentChat()" #chatBox='ngForm'>

    <div class="field">
      <input 
        [(ngModel)]="chat_input"
        #chat_in = "ngModel"
        name="chat_input" 
        class="input is-large"
        type="text" 
        placeholder="输入信息"
        required>
    </div>

    <div class="field">
      <button 
        type="submit"
        class="button is-large is-warning" 
        [disabled]="chatBox.invalid || wait"
        >
        发送
      </button>
    </div>

  </form>
  </div>

  <div class="message is-danger" 
  *ngIf="errorMessage"
  style="
    margin-bottom: 0px;
    ">
  <div class="message-header">
    <p>发生错误</p>
    <button class="delete" aria-label="delete" (click)="clearErrorMess()"></button>
  </div>
  <div class="message-body">
    {{ errorMessage | json }}
  </div>
  </div>

  </section>
  `,
  styles: [
  ]
})
export class BotComponent {
  chat_input = "";
  chat_history: any[] = [];
  wait: boolean = false;
  errorMessage: any;
  
  constructor(private chatService: ChatService){}

  sentChat(){
    const message = this.chat_input;
    this.chat_history.push({ role: 'user', content: message });
    this.chat_input = "";
    this.wait = true;

    this.chatService.sentMessage(this.chat_history)
    .subscribe(
      (response: any) => {
        console.log(response)
      this.chat_history.push({ role: 'assistant', content: response.choices[0].message.content });
      this.wait = false;
      },
      (error: any) => {
      this.errorMessage = error;
      this.wait = false;
      });

  }
  
  clearErrorMess(){
    this.errorMessage = false;
  }

}