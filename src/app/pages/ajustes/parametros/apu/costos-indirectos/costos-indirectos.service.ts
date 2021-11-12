import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostosIndirectosService {

  constructor( private http: HttpClient ) { }

  getIndirectCosts( params = {} ){
    return this.http.get(`${environment.base_url}/paginateIndirectCost`, {params});
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/indirect-cost`, data);
  }

}
