import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngenieriaService {

  constructor(private http: HttpClient) { }

  getWorkOrdersEngineering(params = {}) {
    return this.http.get(`${environment.base_url}/woe-paginate`, { params });
  }

  getWorkOrder(id) {
    return this.http.get(`${environment.base_url}/work-orders-engineering/${id}`);
  }

  changeStatus(data, id) {
    return this.http.put(`${environment.base_url}/work-orders-engineering/${id}`, data);
  }

  assignEngineering (data) {
    return this.http.post(`${environment.base_url}/work-orders-engineering`, data)
  }
}
