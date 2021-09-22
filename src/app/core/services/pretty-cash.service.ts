import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrettyCashService {
  constructor(private http: HttpClient) {}

  save(body) {
    return this.http.post(environment.base_url + '/pretty-cash', body);
  }
  getAll() {
    return this.http.get(environment.base_url + '/pretty-cash');
}
}
