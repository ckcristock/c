import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CesantiasService {

  constructor(private http: HttpClient) { }

  getCheckLayoffs(params: any){
    return this.http.get(`${environment.base_url}/layoff-list/check-layoffs-list/${params}`);
  }

  /**devuelve la del año actual */
  getLayoffsList(params:any){
    return this.http.get(`${environment.base_url}/layoff-list/${params}`);
  }
  
  getLayoffsListPaginated(params:any){
    return this.http.get(`${environment.base_url}/layoff-list/check-layoffs-list-paginated/${params}`);
  }

}
