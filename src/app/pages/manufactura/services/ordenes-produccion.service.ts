import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenesProduccionService {

  constructor(
    private http: HttpClient
  ) { }

  getWorkOrders(params = {}) {
    return this.http.get(`${environment.base_url}/paginate-work-orders`, { params });
  }
}
