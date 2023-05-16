import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: HttpClient) { }


  save(data: any) {
    return this.http.post(`${environment.base_url}/budgets`, data);
  }
  update(body = {}, id) {
    return this.http.patch(`${environment.base_url}/budgets/${id}`, body);
  }

  getAll(params = {}) {
    return this.http.get(`${environment.base_url}/budgets`, { params });
  }
  getAllPaginate(params = {}) {
    return this.http.get(`${environment.base_url}/budgets-paginate`, { params });
  }
  get(id) {
    return this.http.get(`${environment.base_url}/budgets/${id}`);
  }

  downloadClient(body) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.post(`${environment.base_url}/budgets-download-client`, body, { headers, responseType: 'blob' as 'json' });
  }

  downloadIntern(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/budgets-download-intern/${id}`, { headers, responseType: 'blob' as 'json' });
  }

  getBudgetToAdd(id) {
    return this.http.get(`${environment.base_url}/get-budget-to-add/${id}`);
  }

}
