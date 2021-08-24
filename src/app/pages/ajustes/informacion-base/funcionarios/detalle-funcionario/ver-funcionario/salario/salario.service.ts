import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalarioService {

  constructor( private http: HttpClient ) { }

  getSalaryInfo(id){
    return this.http.get(`${environment.base_url}/salary/${id}`);
  }

  updateSalaryInfo(data){
    return this.http.post(`${environment.base_url}/salary`, data);
  }

}
