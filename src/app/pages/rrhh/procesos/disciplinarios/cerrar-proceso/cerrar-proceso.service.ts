import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CerrarProcesoService {

  constructor( private htpp: HttpClient) { }

  cerrarProceso(id, procesoData){
    console.log(id)
    return this.htpp.put(`${environment.base_url}/process/${id}`, procesoData);
  }
}
