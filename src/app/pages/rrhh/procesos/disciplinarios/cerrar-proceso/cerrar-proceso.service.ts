import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CerrarProcesoService {

  constructor( private http: HttpClient) { }

  cerrarProceso(id, procesoData){
    console.log(id)
    return this.http.put(`${environment.base_url}/process/${id}`, procesoData);
  }

  getFileToDownload(id){
    return this.http.get(`${environment.base_url}/legal_document/${id}`);
  }

}
