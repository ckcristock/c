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
}
