import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Recharge {
  
  // Point to middleware backend (set to actual deployed host in production)
  private url = 'http://localhost:8087/api/recharge';

  constructor(private http: HttpClient) {}

  recharge(mobile: string, amount: number) {
    return this.http.post<any>(this.url, {
      mobile: mobile,
      amount: amount
    });
  }
}