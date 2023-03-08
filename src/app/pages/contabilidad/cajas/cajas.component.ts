import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalService } from 'src/app/core/services/modal.service';
import { PrettyCashService } from 'src/app/core/services/pretty-cash.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  newPrettyCash = new EventEmitter<Boolean>();
  loading: boolean = false;
  form: FormGroup;
  prettyCashList: any[] = [];
  people: any[] = [];
  id_caja: any;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _prettyCash: PrettyCashService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _person: PersonService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getPrettyCash();
  }

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
    })
  }

  async openModal(content, item) {
    this.form = this.fb.group({
      /* id: [''], */
      person_id: ['', Validators.required],
      description: ['', Validators.required],
      status: ['']
    });
    this.getPeople();
    await this._prettyCash.getCaja(item.id).toPromise().then((res: any) => {
      this.id_caja = res.data.id
      this.form.patchValue({
        /* id: res.data.id, */
        person_id: res.data.person_id,
        description: res.data.description,
        status: res.data.status
      });
    })
    this._modal.open(content)

  }

  save() {
    if (this.form.get('person_id').valid) {
      this.form.patchValue({
        status: 'Activa'
      })
    }
    this._prettyCash.update(this.form.value, this.id_caja).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: res.data,
        text: '',
        showCancel: false,
        timer: 1000
      })
      this._modal.close()
      this.getPrettyCash();
    })
  }

  getPrettyCash(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination
    }
    this.loading = true;
    this._prettyCash.getAll(params).subscribe((r: any) => {
      this.prettyCashList = r.data.data
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }
}
