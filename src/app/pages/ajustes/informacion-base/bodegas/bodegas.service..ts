import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  constructor( private http: HttpClient ) { }

  getBodegas( params = {} ) {
    return this.http.get(`${environment.base_url}/paginateBodegas`, {params});
  }

  createBodega( data ) {
    return this.http.post(`${environment.base_url}/bodegas`, data);
  }

  activarInactivar(data) {
    return this.http.post(`${environment.base_url}/bodegas-activar-inactivar`, data);
  }

}