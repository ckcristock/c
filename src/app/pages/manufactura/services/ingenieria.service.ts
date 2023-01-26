import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IngenieriaService {

  constructor(private http: HttpClient) { }

  getWorkOrder(id) {
    return this.http.get(`${environment.base_url}/work-orders-engineering/${id}`);
  }
}
