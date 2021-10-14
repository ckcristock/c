import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiudadesService {

  constructor( private http: HttpClient ) { }
  
  getContries(){
    return this.http.get(`${environment.base_url}/countries`);
  }

  createCity( data:any ){
    return this.http.post(`${environment.base_url}/cities`, data);
  }

  getCities( params = {} ){
    return this.http.get(`${environment.base_url}/paginateCities`, {params});
  }

}
