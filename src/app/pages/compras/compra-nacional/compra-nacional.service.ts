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
}
