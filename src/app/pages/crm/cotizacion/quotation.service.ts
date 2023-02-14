import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(
    private http: HttpClient
  ) { }

  getQuotations(params = {}) {
    return this.http.get(`${environment.base_url}/paginateQuotations`, { params });
  }

  getAllQuotations() {
    return this.http.get(`${environment.base_url}/quotations`);
  }

  updateQuotation(data: any, id) {
    return this.http.put(`${environment.base_url}/quotations/${id}`, data);
  }

  getTRM(params = {}) {
    return this.http.get('https://www.datos.gov.co/resource/ceyp-9c7c.json', { params })
  }

  save(data) {
    return this.http.post(`${environment.base_url}/quotations`, data)
  }

  getQuotation(id) {
    return this.http.get(`${environment.base_url}/quotations/${id}`);
  }

  getTexts() {
    return this.http.get(`${environment.base_url}/get-texts-company`);
  }

  download(id: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/quotation/pdf/${id}`, { headers, responseType: 'blob' as 'json' });
  }
}
