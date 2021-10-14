import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  constructor( private http: HttpClient ) { }

  getAllContracts( params = {} ){
    return this.http.get(`${environment.base_url}/work_contracts`, { params }).pipe(map((r:any)=>{
      r.data.data = r.data.data.map(d=>{
        if(d.conclude == '1' && d.date_end ){
          d.date_of_notify = moment(d.date_end).subtract(30,'days').format("YYYY-MM-DD")
        }else{
          d.date_of_notify = '';
    
        }
        d.date_trial = this.getPeriod(d); 
        return d
      })
      console.log(r.data.data);
      
      return r
    }));
  }

  getCompanies() {
    return this.http.get(`${environment.base_url}/company`);
  }

  getContractsToExpire( params = {} ) {
    return this.http.get(`${environment.base_url}/contractsToExpire`, { params });
  }

  getContractByTrialPeriod() {
    return this.http.get(`${environment.base_url}/periodoP`);
  }

  getPeriod(d){
    let date_of_admission = moment(d.date_of_admission)
    let period = 2;
    if (d.conclude == 1) {
      let date_end = moment(d.date_end)
      period = date_end.diff(date_of_admission, 'months', true) / 3 ;
    }
           
    period =  (period > 2 ? 2 : period  ) ;
  
    return date_of_admission.add( period , 'months').format("YYYY-MM-DD");
  }
}
