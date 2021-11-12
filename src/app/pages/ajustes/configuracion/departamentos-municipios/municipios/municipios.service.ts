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

  getMunicipalityPaginate( params = {} ){
    return this.http.get(`${environment.base_url}/paginateMunicipality`, {params});
  }
  
  createNewMunicipality(data:any){
    return this.http.post(`${environment.base_url}/municipalities`, data);
  }

}
