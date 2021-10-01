import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotasContablesService {

  constructor( private http: HttpClient ) { }
  
  getCenterCost(){
    return this.http.get(`${environment.base_url}/center_cost`);
  }

  getThirdParties(){
    return this.http.get(`${environment.base_url}/third-parties-list`);
  }

}
