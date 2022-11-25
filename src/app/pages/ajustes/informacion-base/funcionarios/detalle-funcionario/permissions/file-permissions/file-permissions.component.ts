import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { PersonService } from '../../../../services/person.service';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-file-permissions',
  templateUrl: './file-permissions.component.html',
  styleUrls: ['./file-permissions.component.scss']
})
export class FilePermissionsComponent implements OnInit {
  @Input('personId') personId;
  form: FormGroup;
  saving: boolean;
  id: any;
  folders = [
    { value: 0, text: 'Sin acceso a carpetas' },
    { value: 1, text: 'RRHH' },
    { value: 2, text: 'Contabilidad' },
    { value: 3, text: 'Juridico' },
    { value: 4, text: 'Calidad' },
    { value: 5, text: 'Gerencia' },
  ]
  constructor(
    private fb: FormBuilder,
    private _person: PersonService,
    private _swal: SwalService,
    private _user: UserService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: this.personId,
      folder_id: ['', Validators.required]
    })
    this.getFolderPermission();
  }

  getFolderPermission() {
    this._person.getFilePermission(this.personId).subscribe((res:any) => {
      this.form.patchValue({
        folder_id: res.data
      })
    })
  }

  save() {
    this._person.updateFilePermission(this.form.value).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Carpeta asignada con éxito',
        text: '',
        showCancel: false,
        timer: 1000
      })
    })
  }
}
