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
    return this.http.get(`${environment.base_url}/municipalities`);
  }

  getClient(){
    return this.http.get(`${environment.base_url}/thirdPartyClient`);
  }

  getProfiles(){
    return this.http.get(`${environment.base_url}/apu-profile`);
  }


  getTravelExpenseEstimation(){
    return this.http.get(`${environment.base_url}/travel-expense-estimation`);
  }

  getApuServices( params = {} ){
    return this.http.get(`${environment.base_url}/paginationApuServices`, {params});
  }

  getApuService(id){
    return this.http.get(`${environment.base_url}/apu-service/${id}`);
  }

  update(data:any, id){
    return this.http.put(`${environment.base_url}/apu-service/${id}`, data);
  }

  save(data:any){
    return this.http.post(`${environment.base_url}/apu-service`, data);
  }

  activateOrInactivate( data:any ){
    return this.http.put(`${environment.base_url}/activateOrInactApuService`, data);
  }

}
