import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

  getActivityTypes(){
    return this.http.get(environment.base_url+'/rrhh-activiy-types')
  }
  saveActivityType(data){
    return this.http.post(environment.base_url+'/rrhh-activiy-types',data)
  }
}
