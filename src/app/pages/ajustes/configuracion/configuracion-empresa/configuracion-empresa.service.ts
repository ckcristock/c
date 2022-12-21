import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionEmpresaService {

  constructor( private http: HttpClient ) { }

  getBanks() {
    return this.http.get(`${environment.base_url}/banks`);
  }

  getArl() {
    return this.http.get(`${environment.base_url}/arl`);

  }

  getCompanyData() {
    return this.http.get(`${environment.base_url}/companyData`);
  }
  getCompanyAll() {
    return this.http.get(`${environment.base_url}/companyAll`);
  }

  saveCompanyData(data:any) {
    return this.http.post(`${environment.base_url}/saveCompanyData`, data);
  }

  getPaymentConfiguration(){
    return this.http.get(`${environment.base_url}/companyPayment`);//trae los datos del id 1
  }

  changePaymentConfiguration(data:any) {
    return this.http.post(`${environment.base_url}/companyPayment`, data);
  }

  public getTypeDocuments() {
    return this.http.get(`${environment.base_url}/documentTypes`)
  }

  saveCommercialTerms(data, id){
    return this.http.post(`${environment.base_url}/commercial-terms/${id}`, data)
  }

}
