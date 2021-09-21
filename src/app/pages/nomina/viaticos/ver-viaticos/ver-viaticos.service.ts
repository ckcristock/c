import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerViaticosService {
  constructor(private http: HttpClient) {}

   getAllViaticos(id: string) {
    return this.http.get(`${environment.base_url}/travel-expense/${id}`);
  }

}
