import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ValorAlmuerzosService {

  constructor(private http: HttpClient) { }

  save(data) {
    return this.http.post(environment.base_url + '/lunch-value', data);
  }
  getAll( params = {} ) {
    return this.http.get(environment.base_url + '/paginateLunchValue', {params});
  }
}
