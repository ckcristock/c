import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesosExternosService {

  constructor( private http: HttpClient ) { }

  getExternalProcesses(params = {}){
    return this.http.get(`${environment.base_url}/paginateExternalProcesses`, {params});
  }

  save( data ){
    return this.http.post(`${environment.base_url}/externalprocesses`, data);
  }

  getExternos(){
    return this.http.get(`${environment.base_url}/externalprocesses`);
  }

}
