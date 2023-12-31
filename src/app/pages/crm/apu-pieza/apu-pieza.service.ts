import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApuPiezaService {

  constructor(private http: HttpClient) { }

  getPeopleXSelect() {
    return this.http.get(`${environment.base_url}/people`);
  }

  getCities() {
    return this.http.get(`${environment.base_url}/municipalities`);
  }

  getGeometries(params = {}) {
    return this.http.get(`${environment.base_url}/geometry`, { params });
  }

  getMaterials(params = {}) {
    return this.http.get(`${environment.base_url}/materials`, { params });
  }

  getClient(params = {}) {
    return this.http.get(`${environment.base_url}/thirdPartyClient`, { params });
  }

  getIndirectCosts() {
    return this.http.get(`${environment.base_url}/indirect-cost`);
  }

  save(data: any) {
    return this.http.post(`${environment.base_url}/apu-parts`, data);
  }

  getApuPart(id) {
    return this.http.get(`${environment.base_url}/apu-parts/${id}`);
  }

  update(data: any, id) {
    return this.http.put(`${environment.base_url}/apu-parts/${id}`, data)
  }

  apuPartPaginate(params = {}) {
    return this.http.get(`${environment.base_url}/apu-parts`, { params });
  }

  cutLaserMaterial(params = {}) {
    return this.http.get(`${environment.base_url}/cut-laser-material`, { params });
  }

  activateOrInactivate(data) {
    return this.http.put(`${environment.base_url}/apu-part-activate-Inactive`, data);
  }

  getThicknesses() {
    return this.http.get(`${environment.base_url}/thicknesses`);
  }

  getMaterialThickness() {
    return this.http.get(`${environment.base_url}/material-thickness`);
  }

  download(id: string) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(`${environment.base_url}/apu-pieza/pdf/${id}`, { headers, responseType: 'blob' as 'json' });
  }

  deleteFile(id) {
    return this.http.get(`${environment.base_url}/apu-part-delete-file/${id}`);
  }

}
