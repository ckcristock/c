import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LateArrivalsService {

    constructor(private http: HttpClient) { }

    getLateArrivals(date1,date2) {
        return this.http.get(`${environment.base_url}/late_arrivals/data/${date1}/${date2}`)
    }
  

}
