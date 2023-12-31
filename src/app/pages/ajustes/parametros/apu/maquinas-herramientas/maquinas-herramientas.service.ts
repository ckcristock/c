import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaquinasHerramientasService {

  constructor( private http:HttpClient ) { }

  getMachines(params = {}){
    return this.http.get(`${environment.base_url}/paginateMachines`, { params });
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/machinestools`, data)
  }

  getMaquinas(){
    return this.http.get(`${environment.base_url}/machinestools`)
  }

}
