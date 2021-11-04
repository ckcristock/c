import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApuPiezaService {

  constructor( private http: HttpClient ) { }

  getPeopleXSelect() {
    return this.http.get(`${environment.base_url}/people`);
  }

  getCities() {
    return this.http.get(`${environment.base_url}/city`);
  }

  getGeometries() {
    return this.http.get(`${environment.base_url}/geometry`);
  }

  getMaterials(){
    return this.http.get(`${environment.base_url}/materials`);
  }

  getClient(){
    return this.http.get(`${environment.base_url}/thirdPartyClient`);
  }

  getIndirectCosts(){
    return this.http.get(`${environment.base_url}/indirect-cost`);
  }

}
