import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { text } from 'express';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private apiUrl = "https://expressmiddleware.web.app/getOpenAI";//"http://127.0.0.1:5000/getOpenAI" //"https://api.openai.com/v1/chat/completions";
  private apiKey = "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";

  constructor(private http: HttpClient) {}

  sentMessage(chat_history: any[]) {
    const header = new HttpHeaders({
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT",
      "Access-Control-Allow-Headers": "Content-Type",
      
    })

    const requestData = {
      model: 'gpt-3.5-turbo',
      messages: chat_history,
      //"stream": true
    };

    return this.http.post(this.apiUrl, requestData, { headers: header });
  }

}


