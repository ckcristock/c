import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedidasService {

  constructor( private http: HttpClient ) { }
  
  changeState( data:any ){
    return this.http.put(`${environment.base_url}/act-inact-medidas`, data);
  }

  getMeasures( params = {} ){
    return this.http.get(`${environment.base_url}/paginateMeasure`, {params});
  }

  save( data ){
    return this.http.post(`${environment.base_url}/measure`, data);
  }

}
