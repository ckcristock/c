import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  constructor( private http: HttpClient ) { }

  getAllZones( params = {} ){
    return this.http.get(`${environment.base_url}/zones`, {params});
  }
  getZoneById(id:number){
    return this.http.get(`${environment.base_url}/zone/${id}`);
  }

  createZone( data:any ){
    return this.http.post(`${environment.base_url}/zones`, data);
  }
}
