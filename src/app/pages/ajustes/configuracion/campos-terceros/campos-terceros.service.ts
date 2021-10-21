import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CamposTercerosService {

  constructor( private http: HttpClient ) { }

  getFields(){
    return this.http.get(`${environment.base_url}/third-party-fields`);
  }

  save( data ){
    return this.http.post(`${environment.base_url}/third-party-fields`, data);
  }

}
