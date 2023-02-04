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

  getWorkOrdersIndex(params = {}) {
    return this.http.get(`${environment.base_url}/work-orders`, { params });
  }

  getForStage(params = {}) {
    return this.http.get(`${environment.base_url}/get-wo-for-stage`, { params });
  }

  getWorkOrder(id) {
    return this.http.get(`${environment.base_url}/work-orders/${id}`);
  }

  saveWorkOrder(data) {
    return this.http.post(`${environment.base_url}/work-orders`, data);
  }

  updateWorkOrder(id, data) {
    return this.http.put(`${environment.base_url}/work-orders/${id}`, data);
  }

  uploadBlueprint(data) {
    return this.http.post(`${environment.base_url}/work-orders-blueprints`, data)
  }

  getRequeriments(params = {}) {
    return this.http.get(`${environment.base_url}/requeriments-company`, { params });
  }

}
