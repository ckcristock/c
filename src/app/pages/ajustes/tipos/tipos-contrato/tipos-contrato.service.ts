import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiposContratoService {

  constructor( private http:HttpClient ) { }
  
  getContractsType( params = {} ) {
    return this.http.get(`${environment.base_url}/`, {params});
  }

}
