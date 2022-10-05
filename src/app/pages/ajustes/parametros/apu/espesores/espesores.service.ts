import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EspesoresService {

  constructor( private http: HttpClient ) { }

  getMeasures(params = {}){
    return this.http.get(`${environment.base_url}/paginateThickness`, { params });
  }

  save( data ){
    return this.http.post(`${environment.base_url}/thicknesses`, data);
  }
}
