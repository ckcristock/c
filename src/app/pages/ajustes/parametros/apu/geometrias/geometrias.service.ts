import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeometriasService {
  constructor(private http: HttpClient) {}

  getGeometries(params = {}) {
    return this.http.get(`${environment.base_url}/paginateGeometry`, { params });
  }

  getMesuare() {
    return this.http.get(`${environment.base_url}/measure`).pipe(
      map((r: any) => {
        r.data = r.data.map((d) => {
          d.checked = false;
          return d;
        });
        return r;
      })
      );
  }

  getGeometry(id:any){
    return this.http.get(`${environment.base_url}/geometry/${id}`);
  }

  save( data:any ){
    return this.http.post(`${environment.base_url}/geometry`, data);
  }
  
  update(data, id){
    return this.http.put(`${environment.base_url}/geometry/${id}`, data);
  }

}
