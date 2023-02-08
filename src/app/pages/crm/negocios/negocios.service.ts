import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { observable, Observable, of, Subscriber } from 'rxjs';
import { ObserveOnSubscriber } from 'rxjs/internal/operators/observeOn';
import { environment } from 'src/environments/environment';
/* import { history, negocios } from './data';
import { tareas } from './ver-negocio/tareas.data'; */

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
  }

  changeState(data, id) {
    return this.http.put(`${this.url}/business/${id}`, data);
  }

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

  getHistory(id) {
    return this.http.get(`${this.url}/get-history-business/${id}`)
  }

  newNote(data: any) {
    return this.http.post(`${this.url}/new-business-note`, data)
  }

  getNotes(id) {
    return this.http.get(`${this.url}/business-notes/${id}`)
  }

  changeStatusQyB(data) {
    return this.http.post(`${this.url}/change-status-in-business`, data)
  }
  /* createTask(data) {
    //TODO backend
    return of(
      tareas.push(data)
    )
  } */

  /* editTask(index, data) {
    return of(
      tareas[index] = data
    )
  } */

  /* addEventToHistroy(event) {
    let item = {
      icon: '',
      title: '',
      created_at: '2020-11-2',
      person: {
        full_name: 'Marcos Fuentes',
        image: ''
      },
      description: 'Creacion del negocio',
    };

    return of(
      history.push(item)
    )
  } */


}
