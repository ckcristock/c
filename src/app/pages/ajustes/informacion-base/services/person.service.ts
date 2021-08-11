import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient) { }

  savePerson(form) {
    return this.httpClient.post(`${environment.base_url}/people`, form)
  }
  getPeople(params = {}) {
    return this.httpClient.get(`${environment.base_url}/people-paginate`, { params })
  }

}
