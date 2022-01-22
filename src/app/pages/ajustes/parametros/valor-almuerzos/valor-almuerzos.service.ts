import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ValorAlmuerzosService {

  constructor(private http: HttpClient) { }

  update(data) {
    return this.http.post(environment.base_url + '/lunch-value', data);
  }
  getAll() {
    return this.http.get(environment.base_url + '/lunch-value');
}
}
