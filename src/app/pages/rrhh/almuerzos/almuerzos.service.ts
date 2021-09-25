import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlmuerzosService {

  constructor( private http: HttpClient ) { }
  
  getPeople(){
    return this.http.get(`${environment.base_url}/people`);
  }

  getLunches(){
    return this.http.get(`${environment.base_url}/lunch`);
  }

  createLunch( data:any ) {
    return this.http.post(`${environment.base_url}/lunch`, data);
  }

}
