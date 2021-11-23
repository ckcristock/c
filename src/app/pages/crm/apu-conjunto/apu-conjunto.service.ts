import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApuConjuntoService {

  constructor(private http: HttpClient) { }

  getIndirectCosts(){
    return this.http.get(`${environment.base_url}/indirect-cost`);
  }

  getPeopleXSelect() {
    return this.http.get(`${environment.base_url}/people`);
  }

  getCities() {
    return this.http.get(`${environment.base_url}/city`);
  }

  getClient(){
    return this.http.get(`${environment.base_url}/thirdPartyClient`);
  }

  getApuParts( params = {} ){
    return this.http.get(`${environment.base_url}/apu-parts-list`, {params});
  }

  getApuSetList( params = {} ){
    return this.http.get(`${environment.base_url}/apu-sets-list`, {params});
  }
  
  getApuSets( params = {} ){
    return this.http.get(`${environment.base_url}/apu-sets`, {params});
  }

  getApuSet(id:any){
    return this.http.get(`${environment.base_url}/apu-sets/${id}`);
  }

  save(data:any){
    return this.http.post(`${environment.base_url}/apu-sets`, data);
  }

  update(data:any, id:any){
    return this.http.put(`${environment.base_url}/apu-sets/${id}`, data);
  }
  
  activateOrInactivate( data:any ){
    return this.http.put(`${environment.base_url}/apu-set-activate-Inactive`, data);
  }

  download(id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/apu-set/pdf/${id}`, { headers, responseType: 'blob' as 'json' });
  }

}
