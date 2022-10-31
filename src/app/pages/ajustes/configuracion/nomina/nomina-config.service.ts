import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NominaConfigService {
  constructor(private http: HttpClient) { }

  getExtras() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/extras`
    );
  }
  getIncapacidades() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/incapacidades`
    );
  }
  getParafiscales() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/parafiscales`
    );
  }
  getRiesgos() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/riesgos`
    );
  }
  getSeguridadEmpresa() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/ssocial_empresa`
    );
  }
  getSeguridadFuncionario() {
    return this.http.get(
      `${environment.base_url}/parametrizacion/nomina/ssocial_funcionario`
    );
  }

  updateExtras(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/extras/update/${id}`, data);
  }

  updateSSocialPerson(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/seguridad-social-persona/update/${id}`, data);
  }

  updateSSocialCompany(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/seguridad-social-company/update/${id}`, data);
  }

  updateRiesgosArl(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/riesgos-arl/update/${id}`, data);
  }

  updateParafiscales(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/parafiscales/update/${id}`, data);
  }

  updateIncapacidades(id, data = {}) {
    return this.http.put(`${environment.base_url}/parametrizacion/nomina/incapacidades/update/${id}`, data);
  }


}
