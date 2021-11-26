import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilesApuService {

  constructor( private http: HttpClient ) { }

  getProfiles( params = {} ){
    return this.http.get(`${environment.base_url}/paginationApuProfiles`, {params});
  }

  save(data:any){
    return this.http.post(`${environment.base_url}/apu-profile`, data);
  }
}
