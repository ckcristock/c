import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialesMateriaPrimaService {

  constructor(
    private http: HttpClient
  ) { }

  getRawMaterialMaterials(params = {}) {
    return this.http.get(`${environment.base_url}/paginateRawMaterialMaterial`, { params });
  }

  getRawMaterialMaterialsIndex() {
    return this.http.get(`${environment.base_url}/raw-material-material`);
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/raw-material-material`, data);
  }

  update( data, id ){
    return this.http.put(`${environment.base_url}/raw-material-material/${id}`, data);
  }
}
