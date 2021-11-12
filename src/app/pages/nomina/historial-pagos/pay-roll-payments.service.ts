import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollPaymentsService {
  constructor(private http: HttpClient) {}


  getPayrollHistory() {
    return this.http.get(`${environment.base_url}/payroll/history/payments`);
  }
  
  
}
