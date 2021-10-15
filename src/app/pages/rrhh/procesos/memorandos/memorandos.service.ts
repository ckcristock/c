import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemorandosService {

  constructor( private http: HttpClient ) { }

  getPeople() {
    return this.http.get(`${environment.base_url}/people`);
  }

  createNewMemorandum( data:any ) {
    return this.http.post(`${environment.base_url}/memorandum`, data);
  }
  
  getMemorandumLimitated() {
    return this.http.get(`${environment.base_url}/ListLimitated`);
  }

  getTypesOfMemorandum( params = {} ) {
    return this.http.get(`${environment.base_url}/type_memorandum`, {params});
  }

  getMemorandumList( params = {} ) {
    return this.http.get(`${environment.base_url}/memorandums`, {params});
  }

  createNewMemorandumType( data:any ) {
    return this.http.post(`${environment.base_url}/type_memorandum`, data)
  }

  createNewAttentionCall( data:any ) {
    return this.http.post(`${environment.base_url}/attention-call`, data);
  }

  attentionCalls(id){
    return this.http.get(`${environment.base_url}/alert/${id}`);
  }

}
