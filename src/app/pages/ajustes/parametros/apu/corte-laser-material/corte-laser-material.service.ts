import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorteLaserMaterialService {

  constructor( private http: HttpClient ) { }

  getMaterials( params = {} ){
    return this.http.get(`${environment.base_url}/paginateCutLaserMaterial`, {params});
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/cut-laser-material`, data);
  }

  update( data, id ){
    return this.http.put(`${environment.base_url}/cut-laser-material/${id}`, data);
  }
}
