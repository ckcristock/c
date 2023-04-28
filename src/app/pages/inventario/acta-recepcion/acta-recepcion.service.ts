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

  getActasAnuladas(params = {}) {
    return this.http.get(`${environment.base_url}/php/actarecepcion/lista_acta_anula.php`, { params })
  }

  getCausalesAnulacion() {
    return this.http.get(`${environment.base_url}/php/facturasventas/causales_anulacion.php`)
  }

  getActasIngresadas(params = {}) {
    return this.http.get(`${environment.base_url}/php/actarecepcion_nuevo/lista_actarecepcion.php`, { params })
  }

  getActaRecepcionCompra(params = {}) {
    return this.http.get(`${environment.base_url}/php/bodega_nuevo/acta_recepcion_comprad_test.php`, { params })
  }

  detalleActa(params = {}) {
    return this.http.get(`${environment.base_url}/php/bodega_nuevo/detalle_acta_recepcion.php`, { params })
  }

  getActividadesActa(params = {}) {
    return this.http.get(`${environment.base_url}/php/actarecepcion/actividades_acta_recepcion_compra.php`, { params })
  }

  codigoBarras(params = {}) {
    return this.http.get(environment.base_url + '/php/actarecepcion/codigo_barrad.php', { params })
  }
}
