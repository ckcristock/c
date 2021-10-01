import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CrearViaticosService {
  constructor(private http: HttpClient) {}

  getPeople() {
    return this.http.get(`${environment.base_url}/people-all`);
  }

  getHotels() {
    return this.http.get(`${environment.base_url}/hotels`);
  }

  /*  getTaxis() {
    return this.http.get(`${environment.base_url}/taxis`);
  } */

  getCity() {
    return this.http.get(`${environment.base_url}/city`);
  }

  getCities() {
    return this.http.get(`${environment.base_url}/city`);
  }

  getRouteTaxi() {
    return this.http.get(`${environment.base_url}/taxis`);
  }

  crearViatico(data: any) {
    return this.http.post(`${environment.base_url}/travel-expense`, data);
  }

  actualizarViatico(id:string, data: any) {
    return this.http.post(`${environment.base_url}/travel-expense/update/${id}`, data);
  }
  getAllViaticos(data: any) {
    return this.http.get(`${environment.base_url}/travel-expense`);
  }

}
