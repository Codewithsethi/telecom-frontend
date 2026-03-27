import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Recharge {
  
 private url = 'http://localhost:8080/api/recharge';

  constructor(private http: HttpClient) {}

  recharge(mobile: string, amount: number) {
    return this.http.post<any>(this.url, {
      mobile: mobile,
      amount: amount
    });
  }
}