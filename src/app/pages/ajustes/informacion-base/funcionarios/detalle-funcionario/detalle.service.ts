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
    return this.http.put(`${environment.base_url}/liquidateOrActivate/${id}`, data);
  }

  getUser(id){
    return this.http.get(`${environment.base_url}/users/${id}`);
  }

  blockUser( data:any, id ){
    return this.http.put(`${environment.base_url}/blockOrActivate/${id}`, data);
  }

  getLiquidation(id) {
    return this.http.get(`${environment.base_url}/liquidation/${id}`);
  }

  descargar(body){
    return this.http.post(`${environment.base_url}/nomina/liquidaciones/previsualizacion`, body)
  }
}
