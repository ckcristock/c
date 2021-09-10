import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsignacionTurnosService {

  constructor( private http:HttpClient) { }
  getTurns(){
    
  }
  getPeople(week,params = {}){
      return this.http.get(`${environment.base_url}/horarios/datos/generales/${week}`,{params})
  }

  saveHours(body){
    return this.http.post(`${environment.base_url}/rotating-hour`,body)

  }
}
