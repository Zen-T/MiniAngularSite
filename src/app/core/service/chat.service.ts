import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = "https://13.209.7.147/chatApi"//"https://13.209.7.147/getOpenAI"//"https://middleware-express-1414c4452662.herokuapp.com/getOpenAI"//"https://expressmiddleware.web.app/getOpenAI";//"http://127.0.0.1:5000/getOpenAI" //"https://api.openai.com/v1/chat/completions";

  constructor(private http: HttpClient) {}

  sentMessage(chat_history: any[]) {
    const header = new HttpHeaders({
      //"Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": 'application/json',
    })

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: chat_history,
      //"stream": true
    };

    return this.http.post(this.apiUrl, requestData, { headers: header });
  }

}