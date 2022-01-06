import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, of, Subscriber } from 'rxjs';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { environment } from 'src/environments/environment';
import { negocios } from './data';
import { tareas } from './ver-negocio/tareas.data';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  url = environment.base_url;

  constructor(private http: HttpClient) { }

  getCompanies(params = {}) {
    return this.http.get(`${this.url}/third-party`, { params })
  }

  saveNeg(data): Observable<any> {
    //TODO Backend para guardar negocio

    return new Observable(() => {
      localStorage.setItem(`negocio ${data.request_name}`, JSON.stringify(data))
    })
  }

  getNeg() {
    return of(
      negocios
    )
  }

  getThirdPartyPerson(params = {}) {
    return this.http.get(`${this.url}/third-party-person`, { params });
  }

  getCountries() {
    return this.http.get(`${this.url}/countries`)
  }

  getCities(params = {}) {
    return this.http.get(`${this.url}/cities`, { params })
  }

  createTask(data) {
    //TODO backend
    return of(
      tareas.push(data)
    )
  }
  editTask(index, data) {

    return of(
      tareas[index] = data
    )

  }
  getTasks(){
    return of(
      tareas
    )
  }
}
