import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivosFijosService {

  constructor( private http: HttpClient ) { }

  getPeople() {
    return this.http.get(`${environment.base_url}/people`);
  } 

  getFixedAssetType(){
    return this.http.get(`${environment.base_url}/fixed_asset_type`);
  }

}
