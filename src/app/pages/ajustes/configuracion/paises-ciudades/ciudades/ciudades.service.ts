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

  getCitiesByStateId(state_id, params){ //ciudades por Departamento id
    return this.http.get(`${environment.base_url}/cities/${state_id}`, {params});
  }

  getCitiesByMunicipalityId(municipality_id, params){
    return this.http.get(`${environment.base_url}/cities-by-municipalities/${municipality_id}`, {params});
  }

  createCity( data:any ){
    return this.http.post(`${environment.base_url}/cities`, data);
  }

  getCities( params = {} ){
    return this.http.get(`${environment.base_url}/paginateCities`, {params});
  }

  delete(id){
    return this.http.post(`${environment.base_url}/countries`, id);// 'borrado lógico '+id
  }

}
