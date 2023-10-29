import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CarsServiceService {

  constructor(private http: HttpClient) {}

  getCars(apiKey:string, maker:string){
    const apiUrl ="https://api.api-ninjas.com/v1/cars?limit=50&&make="+maker
    const apiKeyHeader = new HttpHeaders({["X-Api-Key"]: apiKey});
    return this.http.get(`${apiUrl}`, {headers: apiKeyHeader});
  }
}

