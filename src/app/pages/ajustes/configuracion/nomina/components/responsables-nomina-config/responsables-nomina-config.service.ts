import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsablesNominaConfigService {

  constructor(private http: HttpClient) { }

  getPeopleWithDni(params) {
    return this.http.get<[any, string[]]>(
      `${environment.base_url}/people-with-dni`, { params }
    ).pipe(
      map(response => response['data'])
    );;
  }

  getResponsablesNomina() {
    return this.http.get(
      `${environment.base_url}/payroll-manager`
    );
  }

  createUpdatePayrollManager(data){
    return this.http.post(
      `${environment.base_url}/payroll-manager`, data
    )
  }

}
