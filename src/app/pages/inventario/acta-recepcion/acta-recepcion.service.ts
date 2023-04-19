import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActaRecepcionService {

  constructor(
    private http: HttpClient
  ) { }

  getComprasPendientes(params = {}) {
    return this.http.get(`${environment.base_url}/php/bodega_nuevo/lista_compras_pendientes.php`, { params })
  }

  getActaRecepcion(params = {}) {
    return this.http.get(`${environment.base_url}/php/actarecepcion_nuevo/lista_actas_pendientes.php`, { params })
  }
}
