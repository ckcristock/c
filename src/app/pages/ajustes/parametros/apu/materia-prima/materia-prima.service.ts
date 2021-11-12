import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MateriaPrimaService {

  constructor( private http: HttpClient ) { }

  getRawMaterials( params = {} ){
    return this.http.get(`${environment.base_url}/raw-materials`, {params});
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/raw-materials`, data);
  }

  update( data:any, id ){
    return this.http.put(`${environment.base_url}/raw-materials/${id}`, data);
  }

}
