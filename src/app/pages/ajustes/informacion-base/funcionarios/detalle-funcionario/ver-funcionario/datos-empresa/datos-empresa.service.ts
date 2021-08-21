import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosEmpresaService {

  constructor( private http: HttpClient ) { }

  getEnterpriseData(id){
    return this.http.get(`${environment.base_url}/enterpriseData/${id}`);
  }

}
