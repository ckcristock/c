import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JobService {

    constructor(private http: HttpClient) { }

    getJob( id ) {
        return this.http.get(`${environment.base_url}/jobs/${id}`)
    }
    getJobs( params = {} ) {
        return this.http.get(`${environment.base_url}/jobs`, { params })
    }
    save( params = {} ) {
        return this.http.post(`${environment.base_url}/jobs`, params)
    }

    setState( id, params = {} ){
        return this.http.post(`${environment.base_url}/jobs/set-state/${id}`, params)
    }

}
