import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DotacionService {

    constructor(private http: HttpClient) { }

    getInventary( params = {} ) {
        return this.http.get(`${environment.base_url}/inventary-dotation`, {params})
    }
    getInventaryBYGrops( params = {} ) {
        return this.http.get(`${environment.base_url}/inventary-dotation-by-group`, {params})
    }

    getInventaryGrops( params = {} ){
        return this.http.get(`${environment.base_url}/inventary-dotation-group`, {params})
    }
    saveGroup( data ){
        return this.http.post(`${environment.base_url}/inventary-dotation-group`, data)
    }
    
    getCuantityDispatched( params )
    {
        return this.http.get(`${environment.base_url}/inventary-dotation-statistics`, {params})
    }
    getStok( params )
    {
        return this.http.get(`${environment.base_url}/inventary-dotation-stock`, {params})
    }

}
