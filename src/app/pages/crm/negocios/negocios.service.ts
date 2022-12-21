import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, of, Subscriber } from 'rxjs';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { environment } from 'src/environments/environment';
import { history, negocios } from './data';
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

  getThirds() {
    return this.http.get(`${this.url}/third-parties-list`)
  }

  saveNeg(data) {
    return this.http.post(`${this.url}/business`, data);
    // return new Observable(() => {
    //   localStorage.setItem(`negocio ${data.request_name}`, JSON.stringify(data))
    // })
  }

  changeState(data, id) {
    return this.http.put(`${this.url}/business/${id}`, data);
  }

  getNeg() {
    return of(
      negocios
    )
  }

  /* getBusinesses() {
    return this.http.get(`${this.url}/business`);
  } */

  getBusinesses(params = {}) {
    return this.http.get(`${this.url}/paginateBusiness`, { params });
  }

  getThirdPartyPerson(params = {}) {
    return this.http.get(`${this.url}/third-party-person`, { params });
  }

  getThirdPartyPersonForThird(id) {
    return this.http.get(`${this.url}/third-party-person-for-third/${id}`,);
  }

  getCountries() {
    return this.http.get(`${this.url}/countries-with-departments`)
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
  /*
  getTasks(){
    return of(
      tareas
    )
  }*/

  getHistory() {
    return of(
      history
    )
  }
  addEventToHistroy(event) {
    let item = {
      date: new Date().toISOString().slice(0, 10),
      action: event,
      autor: 'yo'
    };

    return of(
      history.push(item)
    )
  }

  getBudgets(params = {}) {
    return this.http.get(`${this.url}/budgets-paginate`, { params })
  }

  getBusiness(id) {
    return this.http.get(`${this.url}/business/${id}`)
  }

  newBusinessBudget(data) {
    return this.http.post(`${this.url}/new-business-budget`, data);
  }

  newBusinessQuotation(data) {
    return this.http.post(`${this.url}/new-business-quotation`, data);
  }

  getTasks(id) {
    return this.http.get(`${this.url}/get-tasks-business/${id}`)
  }

  saveTask(data: any) {
    return this.http.post(`${environment.base_url}/save-task`, data);
  }

  updateTask(data: any) {
    return this.http.post(`${environment.base_url}/save-task`, data);
  }
}
