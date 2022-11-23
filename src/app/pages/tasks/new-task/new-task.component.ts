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
  @Input() type_task: any;
  @Input() business_id: any = '';
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  private _suscription: any;
  fileString: any = '';
  file: any[] = [];
  files: any[] = [];
  type: any = '';
  loadingTypes: boolean;
  types: any[] = []
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
    this.getTypes();
    this.createForm();
    this._suscription = this.open.subscribe((data: any) =>
      this._modal.open(this.newtask, 'lg')
    );
  }

  getPeople() {
    this._task.personCompany(this.company_id).subscribe((res: any) => {
      this.people = res.data
    })
  }

  getTypes() {
    this.loadingTypes = true;
    this._task.getTypes().subscribe((res: any) => {
      this.types = res.data;
      if (this.type_task) {
        this.types.forEach(type => {
          if (type.text == 'Negocios') {
            this.form.patchValue({ type_id: type.value })
            /* this.form.get('type_id'). */
          }
        });
      }
      this.loadingTypes = false;
    })
  }

  createForm() {
    this.form = this.fb.group({
      id_realizador: ['', Validators.required],
      type_id: ['', Validators.required],
      titulo: ['', Validators.required],
      descripcion: [''],
      descripcion_aux: ['', Validators.required],
      fecha: ['', Validators.required],
      files: [''],
      link: [''],
      id_asignador: this._user.user.person.id,
      hora: ['', Validators.required],
      business_id: [this.business_id],
    })
  }

  deleteFiles(id) {
    this.files = this.files.filter(function (e) { return e.id != id })
    this.file = this.file.filter(function (e) { return e.id != id })
  }

  onFileChanged(event) {
    let f = event.target.files;
    for (let i = 0; i < f.length; i++) {
      let params = {
        name: f[i].name,
        id: i
      }
      this.files.push(params)
      let file = f[i];
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
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file.push({
          id: i,
          name: file.name,
          type: this.type,
          base64: base64
        });
      });
    }
  }

  save() {
    if (this.form.value.link) {
      this.form.patchValue({
        link: this.router.url
      })
    }
    this.form.patchValue({
      descripcion: btoa(this.form.value.descripcion_aux),
      files: this.file,
      id_asignador: this._user.user.person.id,
    })
    this._task.save(this.form.value).subscribe((res: any) => {
      this._modal.close()
      this.form.reset()
      this.createForm()
      this.file = []
      this.files = []
      this.refresh.emit()
      Swal.fire({
        title: res.data,
        text: '¿Deseas ir a la tarea?',
        showDenyButton: true,
        icon: 'success',
        confirmButtonText: 'Sí',
        confirmButtonColor: '#A3BD30',
        denyButtonText: `No`,
        denyButtonColor: '#d33',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/task', res.code])
        }
      });
    })
  }
}
