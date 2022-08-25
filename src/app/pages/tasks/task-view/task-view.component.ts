import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../ajustes/informacion-base/services/task.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { TexteditorService } from '../../ajustes/informacion-base/services/texteditor.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  estado: any;
  idtask: any;
  taskdata: any;
  date: any;
  fechaActual: any;
  horaActual: any;
  realizador: any;
  myComment: any;
  commentSave: any;
  comments = []
  deleteCommentStatus: any
  adjuntos: any;
  link: any;
  datePipe = new DatePipe('es-CO');

  constructor(
    private _task: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private _user: UserService,
    private sanitizer: DomSanitizer,
    private _texteditor: TexteditorService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idtask = params.get('id');
      this.taskView();
    });
    this.obtenerAdjuntos();
    this.nuevoComentario();
    this.getComment();
    this.date = Date();
    this.fechaActual = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.horaActual = this.datePipe.transform(this.date, 'hh:mm a');
  }  

  deleteComment(commentId) {
    this._task.deleteComment(commentId).subscribe(
      (d: any) => {
        this.deleteCommentStatus = d.code
      }
    )
    this.getComment()
  }

  downloadAd(url) {
    this._task.downloadAd(url)
  }

  getComment() {
    this._task.getComments(this.route.snapshot.paramMap.get("id")).subscribe(
      (d: any) => {
        this.comments = d.data;
        for (let i in d.data) {
          this.comments[i].comentario = this.sanitizer.bypassSecurityTrustHtml(atob(this.comments[i].comentario))
          if (d.data[i].id_person == this._user.user.person.id) {
            this.comments[i].deleteItem = true
          } else {
            this.comments[i].deleteItem = false
          }
        }
      });
  }

  nuevoComentario() {
    this.myComment = new FormGroup({
      comentario: new FormControl(),
    });
  }

  saveComment() {
    var fecha = Date();
    fecha = this.datePipe.transform(fecha, 'yyyy-MM-dd HH:mm:ss')
    this.commentSave = {
      id_person: this._user.user.person.id,
      fecha: fecha,
      comentario: btoa(this.myComment.value.comentario),
      id_task: this.route.snapshot.paramMap.get("id")
    }
    this.commentSave = JSON.stringify(this.commentSave)
    this._task.newComment(this.commentSave).subscribe(
      (d: any) => {
        if (d.code == 200) {
          this.getComment()
          this.myComment.reset()
        }
      }
    )
  }

  updateArchivada() {
    this._task.updateArchivada(this.route.snapshot.paramMap.get("id")).subscribe()
    this.taskView()
  }

  eliminarTarea() {
    this._task.eliminarTarea(this.route.snapshot.paramMap.get("id")).subscribe()
    this.router.navigate(["/task"])
  }

  obtenerAdjuntos() {
    this._task.obtenerAdjuntos(this.route.snapshot.paramMap.get("id")).subscribe(
      (d: any) => {
        this.adjuntos = d.data
        for (let i in this.adjuntos) {
          this.link = new Uint8Array(atob(d.data[i].fileview).split('').map(char => char.charCodeAt(0)));
          const r = new Blob([this.link], { type: d.data[i].tipo });
          const url = window.URL.createObjectURL(r);
          let satinizedUrl = this.sanitizer.bypassSecurityTrustUrl(url)
          this.adjuntos[i].blob = url;
        }
      }
    )
  }
  
  abrirBlob(blob) {
    window.open(blob);
  }

  taskView() {
    this._task.taskView(this.idtask).subscribe(
      (d: any) => {
        if (d.data[0].id_realizador == this._user.user.person.id || d.data[0].id_asignador == this._user.user.person.id) {
          this.taskdata = d.data[0];
          this.taskdata.descripcion = this.sanitizer.bypassSecurityTrustHtml(atob(this.taskdata.descripcion))
          if (this.taskdata.descripcion.changingThisBreaksApplicationSecurity == 'null') {
            this.taskdata.descripcion.changingThisBreaksApplicationSecurity = 'Ups, no existe una descripción para esta tarea'
          }
          this.taskdata.adjuntos = atob(this.taskdata.adjuntos)
          this.realizador = d.code[0]
          if (!this.taskdata.hora) {
            this.taskdata.hora = '00:00:00'
          }
          //this.descripcion = atob(this.taskdata.descripcion)
          var r = this.datePipe.transform(this.taskdata.fecha + ' ' + this.taskdata.hora, 'hh:mm a')
          if (this.fechaActual + ' ' + this.horaActual < this.taskdata.fecha + ' ' + r) {
            this.estado = 'Activa'
            /* console.log(this.taskdata.fecha)
            console.log(this.datePipe.transform(this.taskdata.fecha + ' ' + this.taskdata.hora, 'hh:mm a')) */

          } else {
            this.estado = 'Vencida'
          }
        }
      });
  }

}
