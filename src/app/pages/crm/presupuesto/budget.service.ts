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

  getAll() {
    return this.http.get(`${environment.base_url}/budgets`);
  }
  getAllPaginate(params = {}) {
    return this.http.get(`${environment.base_url}/budgets-paginate`, { params });
  }
  get(id) {
    return this.http.get(`${environment.base_url}/budgets/${id}`);
  }

}
