import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { TaskService } from '../task.service';
import { TexteditorService } from '../../ajustes/informacion-base/services/texteditor.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {
  @ViewChild('newtask') newtask;
  @Input() open: Observable<any> = new Observable();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  private _suscription: any;
  fileString: any = '';
  file: any = '';
  type: any = '';
  tipo = [
    { id: 1, name: 'Tipo 1' },
    { id: 2, name: 'Tipo 2' },
    { id: 3, name: 'Tipo 3' },
    { id: 4, name: 'Tipo 4' },
    { id: 5, name: 'Tipo 5' }
  ];
  form: FormGroup;
  people: any[] = []
  company_id: number;
  constructor(
    private _modal: ModalService,
    public _task: TaskService,
    private fb: FormBuilder,
    private _texteditor: TexteditorService,
    private _user: UserService,
    private _swal: SwalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.company_id = this._user.user.person.company_worked.id
    this.getPeople();
    this.createForm();
    this._suscription = this.open.subscribe((data: any) =>
      this._modal.open(this.newtask, 'lg')
    );
  }

  getPeople() {
    this._task.personCompany(this.company_id).subscribe((res:any) => {
      this.people = res.data
      console.log(this.people)
    })
  }

  createForm() {
    this.form = this.fb.group({
      id_realizador: ['', Validators.required],
      tipo: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      adjuntos: [''],
      link: [''],
      id_asignador: this._user.user.person.id,
      hora: ['', Validators.required],
      type: ['']
    })
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
        this.form.patchValue({
          adjuntos: this.file,
          type: this.type
        })
      });

    }
  }

  save() {
    if (this.form.get('link').value != null) {
      this.form.patchValue({
        link: (this.router.url).toString().split('/').join('_')
      })
    }
    this.form.patchValue({
      descripcion: btoa(this.form.value.descripcion),
    })
    this._task.save(this.form.value).subscribe((res:any) => {
      this._modal.close()
      this.form.reset()
      Swal.fire({
        title: res.data,
        text: '¿Deseas ir a la tarea?',
        showDenyButton: true,
        icon: 'success',
        confirmButtonText: 'Sí',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/task', res.code])
        }
      });
    })
  }
}
