import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CesantiasService {

  constructor(private http: HttpClient) { }

  getSeverancePayments(params: any = {}) {
    return this.http.get(`${environment.base_url}/severance-payment-paginate`, { params });
  }


}
