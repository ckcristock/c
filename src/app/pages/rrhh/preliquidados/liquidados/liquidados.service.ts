import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidadosService {

  constructor( private http: HttpClient ) { }

  getLiquidado( id:any ){
    return this.http.get(`${environment.base_url}/liquidado/${id}`);
  }

  liquidar(data:any){
    return this.http.post(`${environment.base_url}/`, data);
  }

}
