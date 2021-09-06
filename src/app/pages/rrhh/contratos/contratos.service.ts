import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  constructor( private http: HttpClient ) { }

  getAllContracts( params = {} ){
    return this.http.get(`${environment.base_url}/work_contracts`, { params });
  }

  getCompanies() {
    return this.http.get(`${environment.base_url}/company`);
  }

  getContractsToExpire( params = {} ) {
    return this.http.get(`${environment.base_url}/contractsToExpire`, { params });
  }

  getContractByTrialPeriod() {
    return this.http.get(`${environment.base_url}/periodoP`);
  }

}
