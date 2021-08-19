import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  constructor(private http: HttpClient) { }

  getActivityTypes(){
    return this.http.get(environment.base_url+'/rrhh-activity-types')
  }
  saveActivityType(data){
    return this.http.post(environment.base_url+'/rrhh-activity-types',data)
  }
  setActivityType(data){
    return this.http.post(environment.base_url+'/rrhh-activity-types/set',data)
  }
  
  saveActivity( data ){
    return this.http.post(environment.base_url+'/rrhh-activity',data)
  }
  getActivities( params={} ){
    return this.http.get(environment.base_url+'/rrhh-activity',{params})
  }
  cancelActivity( id ){
    return this.http.get(environment.base_url+'/rrhh-activity/cancel/'+id)
  }
  getPeopleActivity( id ){
    return this.http.get(environment.base_url+'/rrhh-activity-people/'+id)
  }
}
