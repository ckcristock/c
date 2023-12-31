import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DescargoService {

  constructor(private http: HttpClient) { }

  
  getDisciplinaryProcess( params = {} ) {
    return this.http.get(`${environment.base_url}/disciplinary_process`, {params});
  }

  download(file, type?, params = {}) {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get(
      `${environment.base_url}/${type == 'jpge' || type == 'jpg' || type == 'png' ? 'image?path=': 'file?path='}${file}`, { responseType: 'blob' as 'json' }
      );
  }

  getFilesToDownload(id){
    return this.http.get(`${environment.base_url}/legal_document/${id}`);
  }

  saveFiles(data){
    return this.http.post(`${environment.base_url}/legal_document`, data);
  }

  createAnotacion(data){
    return this.http.post(`${environment.base_url}/annotation`, data);
  }

  cancelAnnotation(id, data){
    return this.http.put(`${environment.base_url}/annotation/${id}`, data);
  }

  getAnnotations(id){
    return this.http.get(`${environment.base_url}/annotation/${id}`);
  }

  closeOrOpenProccess(id, data){
    return this.http.put(`${environment.base_url}/process/${id}`, data);
  }

  deleteDocuments(data, id){
    return this.http.put(`${environment.base_url}/legal_document/${id}`, data);
  }

}
