import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialDatosService {

  constructor(private http: HttpClient) {}

    getHistoryDataCompany(){
      return this.http.get(`${environment.base_url}/history-data-company`);
    }
   }

