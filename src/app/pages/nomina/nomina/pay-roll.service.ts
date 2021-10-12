import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollService {
  constructor(private http: HttpClient) {}

  getPayRoll() {
    return this.http.get(`${environment.base_url}/nomina/pago/funcionarios`);
  }
}
