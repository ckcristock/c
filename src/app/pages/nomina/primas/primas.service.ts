import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrimasService {

  constructor( private http: HttpClient ) { }

  getPremiumList(){
    return this.http.get(`${environment.base_url}/`);
  }

  getPremiumPeople(id_prima){
    return this.http.get(`${environment.base_url}/${id_prima}`);
  }

}
