import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor( private http: HttpClient ) { }

  getData( params = {} ){
    return this.http.get(`${environment.base_url}/product`, {params});
  }

}
