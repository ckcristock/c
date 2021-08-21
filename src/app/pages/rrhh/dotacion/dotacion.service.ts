import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DotacionService {

  constructor(private http: HttpClient) { }

  getInventary(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation`, { params })
  }
  getInventaryGroupByCategory(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation-by-category`, { params })
  }

  getProductDotationTypes(params = {}) {
    return this.http.get(`${environment.base_url}/product-dotation-types`, { params })
  }
  saveProductDotationTypes(data) {
    return this.http.post(`${environment.base_url}/product-dotation-types`, data)
  }

  getCuantityDispatched(params) {
    return this.http.get(`${environment.base_url}/inventary-dotation-statistics`, { params })
  }
  getStok(params = {}) {
    return this.http.get(`${environment.base_url}/inventary-dotation-stock`, { params })
  }

  saveDotation(data) {
    return this.http.post(`${environment.base_url}/dotations`, data)
  }

  getDotations(params = {}) {
    return this.http.get(`${environment.base_url}/dotations`, { params })
  }

  setDotation({ id, data }) {
    return this.http.post(`${environment.base_url}/dotations-update/${id}`, data)

  }
  getDotationTotalByCategory( params ){
    return this.http.get(`${environment.base_url}/dotations-total-types`, { params })
  }
}
