import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PayrollFactorService {

    constructor(private http: HttpClient) { }

    getPayrollFactor(params) {
        return this.http.get(`${environment.base_url}/payroll-factor`, { params })
    }
    getPayrollFactorPeople(params) {
        return this.http.get(`${environment.base_url}/payroll-factor-people`, { params }).pipe(
            map(( r:any )=> {
                if (r.data) { r.data = r.data.map(r=> { r.selected = false; return r }) }
                return r
            })
        )
    }
    savePayrollFactor(form) {
        return this.http.post(`${environment.base_url}/payroll-factor`, form)
    }




}
