import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {

  constructor(private http: HttpClient) { }

  getWorkOrdersProduction(params = {}) {
    return this.http.get(`${environment.base_url}/wop-paginate`, { params });
  }

  getWorkOrder(id) {
    return this.http.get(`${environment.base_url}/work-orders-production/${id}`);
  }

  changeStatus(data, id) {
    return this.http.put(`${environment.base_url}/work-orders-production/${id}`, data);
  }

  assignDesign (data) {
    return this.http.post(`${environment.base_url}/work-orders-production`, data)
  }
}
