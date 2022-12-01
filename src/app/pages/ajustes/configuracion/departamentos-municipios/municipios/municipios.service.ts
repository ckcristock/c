import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MunicipiosService {

  constructor( private http: HttpClient ) { }

  getAllMunicipalities(){
    return this.http.get(`${environment.base_url}/municipalities`);
  }

  getAllMunicipalitiesByDepartment(state_id, params){
    return this.http.get(`${environment.base_url}/municipalities/${state_id}`, {params});
  }

  getMunicipalitiesByDepartment(state_id){
    return this.http.get(`${environment.base_url}/municipalities-for-dep/${state_id}`);
  }

  getMunicipalityPaginate( params = {} ){
    return this.http.get(`${environment.base_url}/paginateMunicipality`, {params});
  }

  createNewMunicipality(data:any){
    return this.http.post(`${environment.base_url}/municipalities`, data);
  }

  delete(municipality_id: any, data: any){
    return this.http.post(`${environment.base_url}/${municipality_id}`, data);// 'borrado lógico '+id / hacer en el back
  }

}
