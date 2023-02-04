import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PayRollService {
  constructor(private http: HttpClient) {}

  getPayrollPays({ date1 = '', date2 = ''} ) {
    const uri = '/nomina/pago' + ( date1 && date2 ? `/${date1}/${date2}`  : '')
    return this.http.get(`${environment.base_url}${uri}`);
  }
  getPeoplePayroll() {
    return this.http.get(`${environment.base_url}/nomina/pago/funcionarios`);
  }

  savePayroll( body ){

    return this.http.post(`${environment.base_url}/payroll/pay`, body );
  }

  deletePayroll(){ //no debería poder eliminarse la nómina, al menos no fisicamente
    return this.http.delete(`${environment.base_url}/nomina/pago/funcionarios`);

  }

  downloadExNomina(params){
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(`${environment.base_url}/download-payroll`, params, {headers, responseType: 'blob' as 'json'});
    //return this.http.get(`${environment.base_url}/download-payroll`, {headers, responseType: 'blob' as 'json'});
  }

}
