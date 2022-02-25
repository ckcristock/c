import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  constructor( private http: HttpClient ) { }

  getMaterials( params = {} ){
    return this.http.get(`${environment.base_url}/paginateMaterial`, {params});
  }

  getThicknesses(){
    return this.http.get(`${environment.base_url}/thicknesses`);
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/materials`, data);
  }

  update( data, id ){
    return this.http.put(`${environment.base_url}/materials/${id}`, data);
  }

}
