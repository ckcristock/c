import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(
    private http: HttpClient,
  ) { }

  getAsignadas(id) {
    return this.http.get(`${environment.base_url}/taskfor/${id}`)
  }
  personCompany(companyId) {
    return this.http.get(`${environment.base_url}/taskperson/${companyId}`)
  }
  personTasks( params = {} ) {
    return this.http.get(`${environment.base_url}/person-tasks`, {params})
  }

  statusUpdate( data ) {
    return this.http.post(`${environment.base_url}/status-update`, data)
  }

  updateArchivada(id) {
    return this.http.post(`${environment.base_url}/updatearchivada/${id}`, id)
  }

  save( data ) {
    return this.http.post(`${environment.base_url}/newtask`, data)
  }
  taskView(id) {
    return this.http.get(`${environment.base_url}/taskview/${id}`)
  }
  newComment(comment) {
    return this.http.post(`${environment.base_url}/newcomment/${comment}`, comment)
  }
  getComments(idTask) {
    return this.http.get(`${environment.base_url}/getcomments/${idTask}`)
  }
  deleteComment(commentId) {
    return this.http.get(`${environment.base_url}/deletecomment/${commentId}`)
  }
  eliminarTarea(idTarea) {
    return this.http.get(`${environment.base_url}/deletetask/${idTarea}`)
  }

  obtenerAdjuntos(idTask) {
    return this.http.get(`${environment.base_url}/adjuntostask/${idTask}`)
  }

  downloadAd(url) {
    return this.http.get(`${environment.base_url}/downloadad/${url}`)
  }
}
