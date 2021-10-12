import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisciplinariosService {

  constructor( private http: HttpClient ) { }

  getPeople() {
    return this.http.get(`${environment.base_url}/people`);
  }
  
  getDisciplinaryProcess( params = {} ) {
    return this.http.get(`${environment.base_url}/disciplinary_process`, {params});
  }

  createNewProcess( data:any ) {
    return this.http.post(`${environment.base_url}/disciplinary_process`, data);
  }

  getHistory( id:any ) {
    return this.http.get(`${environment.base_url}/disciplinary_process/${id}`);
  }
  
  getProcessByPerson(id:any){
    return this.http.get(`${environment.base_url}/process/${id}`);
  }
  
  downloadPDF(id, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/descargo/${id}`, {params, headers, responseType: 'blob' as 'json' });
  }

  download(file, params = {}) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/file?path=${file}`, { responseType: 'blob' as 'json' });
  }

}
