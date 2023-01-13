import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor( private http: HttpClient ) { }

  getData( params = {} ){
    return this.http.get(`${environment.base_url}/product`, {params});
  }

  getTiposCatalogo(){
    return this.http.get(`${environment.base_url}/lista-tipos-catalogo`);
  }

  getEstados(){
    return this.http.get(`${environment.base_url}/get-estados-producto`);
  }

  getCampos(params = {}){
    return this.http.get(`${environment.base_url}/vars-subcategoria-producto`,{params});
  }

  changeEstado( data:any ) {
    return this.http.post(`${environment.base_url}/cambiar-estado-producto/`, data);
  }

  saveProduct( data:any ) {
    return this.http.post(`${environment.base_url}/product`, data);
  }

}
