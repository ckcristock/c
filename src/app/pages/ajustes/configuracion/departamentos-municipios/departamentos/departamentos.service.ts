import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {

  constructor( private http:HttpClient ) { }

  getDepartmentPaginate( params = {} ){
    return this.http.get(`${environment.base_url}/paginateDepartment`, {params} );
  }

  createNewDepartment( data ){
    return this.http.post(`${environment.base_url}/departments`, data);
  }

}
