import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DescargoService {

  constructor(private http: HttpClient) { }

  
  getDisciplinaryProcess( params = {} ) {
    return this.http.get(`${environment.base_url}/disciplinary_process`, {params});
  }

  download(file, params = {}) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/file?path=${file}`, { responseType: 'blob' as 'json' });
  }


  createAnotacion(data){
    return this.http.post(`${environment.base_url}/annotation`, data);
  }

  getAnnotations(id){
    return this.http.get(`${environment.base_url}/annotation/${id}`);
  }

}
