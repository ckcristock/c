import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApuServicioService {

  constructor( private http: HttpClient ) { }

  getPeopleXSelect( params = {} ) {
    return this.http.get(`${environment.base_url}/peopleSelects`, {params});
  }

  getCities() {
    return this.http.get(`${environment.base_url}/city`);
  }

  getClient(){
    return this.http.get(`${environment.base_url}/thirdPartyClient`);
  }

}
