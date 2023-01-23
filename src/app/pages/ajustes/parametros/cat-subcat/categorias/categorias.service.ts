import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private http: HttpClient) { }

  paginacionCategorias(params = {}) {
    return this.http.get(`${environment.base_url}/category-paginate`, {params})
    /* return this.http.get(`${environment.base_url}/php/categoria_nueva/detalle_categoria_nueva_general.php`, {params}) */
  }

  getCategorias() {
    return this.http.get(`${environment.base_url}/category`)
  }

  listarCategorias() {
    return this.http.get(`${environment.base_url}/list-categories`)
  }

  getCampos(id:any) {
    return this.http.get(`${environment.base_url}/category-field/${id}`)
  }

  changeActive( id:any, data:any ) {
    return this.http.put(`${environment.base_url}/category-active/${id}`, data);
  }

  saveCategoria( data:any ) {
    return this.http.post(`${environment.base_url}/category`, data);
  }

  deleteVariable( id){
    return this.http.delete(`${environment.base_url}/category-variable/${id}`);
  }
}
