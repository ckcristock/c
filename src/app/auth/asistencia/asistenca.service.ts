import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AsistenciaService {

    constructor(private http: HttpClient) { }

    validate( data ) {
        return this.http.post(`${environment.base_url}/asistencia/validar`,data)
    }
  
}
