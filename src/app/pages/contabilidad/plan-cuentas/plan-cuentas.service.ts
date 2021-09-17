import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanCuentasService {

  constructor( private http: HttpClient ) { }

  getAccount_plan( params = {} ) {
    return this.http.get(`${environment.base_url}/account_plan`, {params});
  }
    
  createAccount_plan( data:any ) {
    return this.http.post(`${environment.base_url}/account_plan`, data);
  }

  getBanks() {
    return this.http.get(`${environment.base_url}/banks`)
  }

}
