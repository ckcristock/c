import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor( private http: HttpClient ) { }

  getAllContracts(){
    return this.http.get(`${environment.base_url}/`);
  }

}
