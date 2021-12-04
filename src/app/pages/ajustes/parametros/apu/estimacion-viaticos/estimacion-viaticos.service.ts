import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimacionViaticosService {

  constructor( private http: HttpClient ) { }

  getTravelExpensEstimations(){
    return this.http.get(`${environment.base_url}/travel-expense-estimation`);
  }
  
  save(data){
    return this.http.post(`${environment.base_url}/travel-expense-estimation`, data);
  }

}
