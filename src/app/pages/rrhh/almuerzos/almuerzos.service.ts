import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlmuerzosService {

  constructor( private http: HttpClient ) { }
  
  getPeople(){
    return this.http.get(`${environment.base_url}/people`);
  }

  getLunches( params = {} ){
    return this.http.get(`${environment.base_url}/lunch`, {params});
  }

  getLunch(id:any){
    return this.http.get(`${environment.base_url}/lunch/${id}`);
  }

  createLunch( data:any ) {
    return this.http.post(`${environment.base_url}/lunch`, data);
  }

  edit( id, data:any ) {
    return this.http.put(`${environment.base_url}/lunch/${id}`, data);
  }

  activateOrInactivate( state ){
    return this.http.put(`${environment.base_url}/state-change`, state);
  }

  getValues() {
    return this.http.get(environment.base_url + '/lunch-value');
  }

  Download(date1, date2, params = {}) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get(`${environment.base_url}/lunches/download/${date1}/${date2}`,{ params, headers, responseType: 'blob' as 'json' });
  }

}
