import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

  constructor(private http: HttpClient) { }

  getVacations() {
    return this.http.get(`${environment.base_url}/pay-vacation`);
  }

  paginateVacations( params = {} ) {
    return this.http.get(`${environment.base_url}/paginate-vacation`, {params});
  }

  saveInformation(data: any) {
    return this.http.post(`${environment.base_url}/pay-vacation`, data);
  }

  download(id) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/download-vacation/${id}`, { headers, responseType: 'blob' as 'json' });
  }
}
