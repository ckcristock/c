import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { EmbalajeService } from './embalaje.service';
import { SwalService } from '../../../services/swal.service';

@Component({
  selector: 'app-embalaje',
  templateUrl: './embalaje.component.html',
  styleUrls: ['./embalaje.component.scss']
})
export class EmbalajeComponent implements OnInit {
  @ViewChild('addPackaging') addPackaging;
  form: FormGroup;
  packagings: any[] = [];
  loading: boolean;
  title = 'Nuevo';
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _modal: ModalService,
    private _embalaje: EmbalajeService,
    private _swal: SwalService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this._modal.open(this.addPackaging);
    this.createForm();
    this.paginate();
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required]
    })
    this.form.get('name').valueChanges.subscribe(r => {
      if (!r) {
        this.form.reset();
        this.title = 'Nuevo'
      }
    })
  }

  edit(item) {
    this.title = 'Editar'
    this.form.patchValue({
      ...item
    })
  }

  paginate(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._embalaje.paginate(this.pagination).subscribe((res: any) => {
      this.packagings = res.data.data;
      this.pagination.collectionSize = res.data.total;
      this.loading = false;
    })
  }

  save() {
    if (this.form.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: this.title == 'Nuevo' ? 'Vamos a agregar un nuevo embalaje' : 'Vamos a editar el embalaje',
      }).then(r => {
        if (r.isConfirmed) {
          this._embalaje.store(this.form.value).subscribe((res: any) => {
            if (res.status) {
              this._swal.show({
                icon: 'success',
                title: res.data,
                text: '',
                showCancel: false,
                timer: 1000
              })
              this.form.reset();
              this.paginate();
              this.title = 'Nuevo'
            } else {
              this._swal.hardError()
            }
          })
        }
      })
    } else {
      this._swal.incompleteError()
    }
  }

}
