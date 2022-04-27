import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core/services/user.service';
import { TaskService } from 'src/app/pages/ajustes/informacion-base/services/task.service';
import { TexteditorService } from 'src/app/pages/ajustes/informacion-base/services/texteditor.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rightsidebar',
  templateUrl: './rightsidebar.component.html',
  styleUrls: ['./rightsidebar.component.scss']
})
export class RightsidebarComponent implements OnInit {
  model: NgbDateStruct;
  closeResult = '';
  pendientes: [];


  //SUBIR ARCHIVOS

  public archivos: any = [];
  public previsualizacion: string;
  errorSubida = false;
  constructor(
    public _task: TaskService,
    private _user: UserService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public fb: FormBuilder,
    private _texteditor: TexteditorService,) {}

  ngOnInit(): void {
    this.getPersonTaskPendiente();
    this._task.getPerson();
  }

  getPersonTaskPendiente() {
    this._task
      .personTaskPendiente(this._user.user.person.id)
      .subscribe(
        (d: any) => {
          this.pendientes = d.data;
          for (let i in d.data){
            this.pendientes[i].descripcion = this.sanitizer.bypassSecurityTrustHtml(atob(this.pendientes[i].descripcion))
          }
        });
  }

  public hide() {
    document.body.classList.remove('right-bar-enabled');
  }

}
