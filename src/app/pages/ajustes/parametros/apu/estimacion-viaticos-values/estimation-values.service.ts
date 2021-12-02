import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimationValuesService {

  constructor( private http: HttpClient ) { }

  getTravelExpenseEstimation(){
    return this.http.get(`${environment.base_url}/travel-expense-estimation`);
  }

  getEstimationValues(){
    return this.http.get(`${environment.base_url}/travelExpenseEstimationValue`);
  }

  save(data){
    return this.http.post(`${environment.base_url}/travelExpenseEstimationValue`, data);
  }

}
