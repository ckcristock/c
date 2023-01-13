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

  getLastId() {
    return this.http.get(`${environment.base_url}/last-id-work-orders`);
  }

  saveWorkOrder(data) {
    return this.http.post(`${environment.base_url}/work-orders`, data);
  }
}
