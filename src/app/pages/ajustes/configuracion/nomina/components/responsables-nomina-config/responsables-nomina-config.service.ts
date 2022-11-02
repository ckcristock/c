import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesNominaConfigService {

  constructor( private http:HttpClient ) { }

  getPeopleWithDni(params){
    return this.http.get(
      `${environment.base_url}/people-with-dni`, {params}
    );
  }

  getResponsablesNomina(){
    return this.http.get(
      `${environment.base_url}/payroll-manager`
    );
  }

}
