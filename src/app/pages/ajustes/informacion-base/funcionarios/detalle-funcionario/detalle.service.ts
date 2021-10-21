import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetalleService {

  constructor( private http:HttpClient ) { }

  getBasicData(id){
    return this.http.get(`${environment.base_url}/person/${id}`);
  }

  liquidar(data:any, id){
    return this.http.put(`${environment.base_url}/liquidate/${id}`, data);
  }
}
