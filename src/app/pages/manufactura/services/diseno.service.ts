import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisenoService {

  constructor(private http: HttpClient) { }

  getWorkOrdersDesign(params = {}) {
    return this.http.get(`${environment.base_url}/wod-paginate`, { params });
  }

  getWorkOrder(id) {
    return this.http.get(`${environment.base_url}/work-orders-design/${id}`);
  }

  changeStatus(data, id) {
    return this.http.put(`${environment.base_url}/work-orders-design/${id}`, data);
  }

  assignDesign (data) {
    return this.http.post(`${environment.base_url}/work-orders-design`, data)
  }
}
