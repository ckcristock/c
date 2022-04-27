import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class TaskService {


  constructor(private http: HttpClient,
    private modalService: NgbModal,
    private _user: UserService,
    private router: Router,
    private sanitized: DomSanitizer) { }

  personTask(id) {
    return this.http.get(`${environment.base_url}/task/${id}`)
  }
  personTaskFor(id) {
    return this.http.get(`${environment.base_url}/taskfor/${id}`)
  }
  personCompany(companyId) {
    return this.http.get(`${environment.base_url}/taskperson/${companyId}`)
  }
  personTaskPendiente(personId) {
    return this.http.get(`${environment.base_url}/person-taskpendientes/${personId}`)
  }
  personTaskEjecucion(personId) {
    return this.http.get(`${environment.base_url}/person-taskejecucion/${personId}`)
  }
  personTaskEspera(personId) {
    return this.http.get(`${environment.base_url}/person-taskespera/${personId}`)
  }
  personTaskFinalizado(personId) {
    return this.http.get(`${environment.base_url}/person-taskfinalizado/${personId}`)
  }
  updateFinalizado(id) {
    return this.http.post(`${environment.base_url}/updatefinalizado/${id}`, id)
  }
  updatePendiente(id2) {
    return this.http.post(`${environment.base_url}/updatependiente/${id2}`, id2)
  }
  updateEjecucion(id3) {
    return this.http.post(`${environment.base_url}/updateejecucion/${id3}`, id3)
  }
  updateEspera(id4) {
    return this.http.post(`${environment.base_url}/updateespera/${id4}`, id4)
  }
  updateArchivada(id) {
    return this.http.post(`${environment.base_url}/updatearchivada/${id}`, id)
  }
  getArchivada(id) {
    return this.http.get(`${environment.base_url}/getarchivada/${id}`, id)
  }
  taskRedirect:any;
  newTask(task, body) {
    const formData = new FormData();
    console.log(body.length)
    for (let i in body) {
      formData.append(`file${i}`, body[i], body[i].name);
    }
    return fetch(`${environment.base_url}/newtask/${task}`, {
      method: 'POST',
      body: formData,
      headers: { "Authorization": `Bearer ${this._user.token}` },

    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        console.log('Success:', response),
        this.taskRedirect = response.data    
      });
    //return this.http.post(`${environment.base_url}/newtask/${task}`, body)
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

  tasksave: any;
  taskjson: any;
  errorSubida = false;
  file: string[] = [];
  onChange(event) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.file.push(event.target.files[i])
    }
  }
  eliminarAdjunto(fileDelete) {
    console.log(fileDelete)
    for (let i = 0; i < this.file.length; i++) {
      if (this.file[i]["id"] == fileDelete) {
        this.file.splice(i, 1)
        console.log('funciona')
      }
    }
  }

  obtenerAdjuntos(idTask){
    return this.http.get(`${environment.base_url}/adjuntostask/${idTask}`)
  }

  downloadAd(url){
    return this.http.get(`${environment.base_url}/downloadad/${url}`)
  }
  saveTask() {
    try {
      if (this.myGroup.value.link != null) {
        this.myGroup.value.link = (this.router.url).toString().split('/').join('_')
      }
      else {
        this.myGroup.value.link = null
      }
      this.tasksave = {
        id_realizador: this.myGroup.value.id_asignador.id,
        tipo: this.myGroup.value.tipo.name,
        titulo: this.myGroup.value.nombre,
        descripcion: btoa(this.myGroup.value.descripcion),
        fecha: this.myGroup.value.fecha,
        adjuntos: this.myGroup.value.adjuntos,
        link: this.myGroup.value.link,
        id_asignador: this._user.user.person.id,
        hora: this.myGroup.value.hora,
        estado: 'Pendiente',
      }
      this.taskjson = JSON.stringify(this.tasksave)
      this.newTask(this.taskjson, this.file)
      this.modalService.dismissAll(); 
               
    } catch (error) {
      console.log('error', error)
      this.errorSubida = true;
    }
    this.file = [];
  }

  person = [];
  getPerson() {
    this.personCompany(this._user.user.person.company_worked.id).subscribe(
      (d: any) => {
        this.person = d.data;
      });
  }
  tipo = [
    { id: 1, name: 'Tipo 1' },
    { id: 2, name: 'Tipo 2' },
    { id: 3, name: 'Tipo 3' },
    { id: 4, name: 'Tipo 4' },
    { id: 5, name: 'Tipo 5' }
  ];
  myGroup: any;
  closeResult = '';

  public open(content) {
    this.myGroup = new FormGroup({
      nombre: new FormControl('', Validators.required),
      tipo: new FormControl(),
      id_asignador: new FormControl(),
      fecha: new FormControl('', Validators.required),
      hora: new FormControl(),
      descripcion: new FormControl(),
      link: new FormControl(),
      adjuntos: new FormControl(),
    });
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public openConfirm(confirm){
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
