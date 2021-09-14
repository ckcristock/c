import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  constructor( private http : HttpClient) { }

  getAll(){
    return this.http.get( `${environment.base_url}/`  )
  }
  
  getNextPayrolls(){
    return this.http.get( `${environment.base_url}/payroll-nex-mouths`  )
  }
  save(){
    return this.http.get( `${environment.base_url}/payroll-nex-mouths`  )
  }
}
