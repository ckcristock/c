import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraNacionalService {

  constructor(private http: HttpClient) { }

  getListaComprasNacionales(params = {}){
    return this.http.get(environment.base_url + '/php/comprasnacionales/lista_compras',{params});
  }

  getDatosComprasNacionales(params = {}){
    return this.http.get(environment.base_url + '/php/comprasnacionales/datos_compras_nacionales', params);
  }

  getActividadOrdenCompra(params = {}){
    return this.http.get(environment.base_url + '/php/comprasnacionales/actividad_orden_compra', params);
  }

  getDetallePerfil(params = {}){
    return this.http.get(environment.base_url + '/php/comprasnacionales/detalle_perfil', params);
  }

  setEstadoCompra(params:any){
    console.log(params);
    return this.http.post(environment.base_url + '/php/comprasnacionales/actualiza_compra', params);
  }
}
