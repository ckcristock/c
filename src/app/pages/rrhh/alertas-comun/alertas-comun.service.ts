import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertasComunService {

  constructor( private http: HttpClient ) { }

  getAlerts() {
    return this.http.get(`${environment.base_url}/`);
  }

  sendAlert( data:any ) {
    return this.http.post(`${environment.base_url}/`, data);
  }

}
