import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcesosInternosService {

  constructor( private http: HttpClient ) { }
  
  getinternalProcesses(params = {}){
    return this.http.get(`${environment.base_url}/paginateInternalProcesses`, {params});
  }

  save( data ){
    return this.http.post(`${environment.base_url}/internalprocesses`, data);
  }

}
