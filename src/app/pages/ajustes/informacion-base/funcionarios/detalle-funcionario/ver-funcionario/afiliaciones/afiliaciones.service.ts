import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AfiliacionesService {

  constructor( private http: HttpClient ) { }

  getAfiliationInfo(id){
    return this.http.get(`${environment.base_url}/epss/${id}`);
  }

  getEpss(){
    return this.http.get(`${environment.base_url}/epss`);
  }

  updateAfiliation(data, id){
    return this.http.post(`${environment.base_url}/updateAfiliation/${id}`, data);
  }

}
