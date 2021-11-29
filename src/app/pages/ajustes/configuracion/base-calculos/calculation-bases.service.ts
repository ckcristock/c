import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CalculationBasesService {
  constructor(private http: HttpClient) {}

  update(body) {
    return this.http.post(environment.base_url + '/calculation-bases-update', body);
  }
  getAll() {
    return this.http.get(environment.base_url + '/calculation-bases');
}
}
