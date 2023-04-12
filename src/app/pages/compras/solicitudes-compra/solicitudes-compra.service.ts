import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesCompraService {

  constructor(
    private http: HttpClient
  ) { }

  getCategoryForSelect() {
    return this.http.get(`${environment.base_url}/get-category-for-select`)
  }

  getProducts(params = {}) {
    return this.http.get<[any, string[]]>(`${environment.base_url}/get-product-typeahead`, { params }).pipe(
      map(response => response['data'])
    );
  }
}
