import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(
    private http: HttpClient
  ) { }

  getQuotations( params = {} ) {
    return this.http.get(`${environment.base_url}/paginateQuotations`, {params});
  }

  getAllQuotations() {
    return this.http.get(`${environment.base_url}/quotations`);
  }

  updateQuotation(data:any, id){
    return this.http.put(`${environment.base_url}/quotations/${id}`, data);
  }
}
