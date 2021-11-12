import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnidadesMedidasService {

  constructor( private http: HttpClient ) { }

  getUnits(){
    return this.http.get(`${environment.base_url}/units`);
  }

  save( data ){
    return this.http.post(`${environment.base_url}/units`, data);
  }

  update( data, id ){
    return this.http.put(`${environment.base_url}/units/${id}`, data);
  }

}
