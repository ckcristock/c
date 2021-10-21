import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TercerosService {

  constructor( private http: HttpClient ) { }

  getZones(){
    return this.http.get(`${environment.base_url}/all-zones`);
  }

  getDepartments(){
    return this.http.get(`${environment.base_url}/departments`);
  }

  getMunicipalities(){
    return this.http.get(`${environment.base_url}/all-municipalities`);
  }

  saveInformation( data:any ){
    return this.http.post(`${environment.base_url}/third-party`, data);
  }

  getThirdParties(params = {}){
    return this.http.get(`${environment.base_url}/third-party`, {params});
  }

  showThirdParty(id){
    return this.http.get(`${environment.base_url}/third-party/${id}`);
  }

  updateThirdParties( data:any, id ){
    return this.http.put(`${environment.base_url}/third-party/${id}`, data);
  }

  getWinningList(){
    return this.http.get(`${environment.base_url}/winnings-list`);
  }

  getCiiuCodesList() {
    return this.http.get(`${environment.base_url}/ciiu-code`);
  }

  getDianAddress(){
    return this.http.get(`${environment.base_url}/dian-address`);
  }

  getAccountPlan(){
    return this.http.get(`${environment.base_url}/account-plan`);
  }

  changeState( data:any ){
    return this.http.put(`${environment.base_url}/activate-inactivate`, data);
  }

  getThirdPartyPerson( params = {} ){
    return this.http.get(`${environment.base_url}/third-party-person`, {params});
  }

  getFields(){
    return this.http.get(`${environment.base_url}/fields-third`);
  }

}
