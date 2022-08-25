import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisesService } from './paises.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-paises',
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.scss']
})
export class PaisesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  paises: any[] = [];
  pais: any = {};
  selected: any;
  filtro: any = {
    name: ''
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  form: FormGroup;
  constructor(
    private _paisesService: PaisesService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getCountries();
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }

  getData(data) {
    this.pais = { ...data };
    this.form.patchValue({
      id: this.pais.id,
      name: this.pais.name
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pais.id],
      name: ['', this.pais.name]
    });
  }

  getCountries(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._paisesService.getCountries(params)
      .subscribe((res: any) => {
        this.paises = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      })
  }

  createCountry() {
    this._paisesService.createCountry(this.form.value)
      .subscribe((res: any) => {
        this.getCountries();
        this.modalService.dismissAll();
        this._swal.show({
          title: res.data,
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
      })
  }

  activateOrInactivate(country, state) {
    let data = {
      id: country.id,
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡El país será desactivado!' : '¡El país será activado!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._paisesService.createCountry(data).subscribe((r: any) => {
            this.getCountries();
          })
          this._swal.show({
            icon: 'success',
            title: (data.state == 'Inactivo' ? '¡País inhabilitado!' : '¡País activado!'),
            text: (data.state == 'Activo' ? 'El país ha sido activado con éxito.' : 'El país ha sido desactivado con éxito.'),
            timer: 1000,
            showCancel: false
          })
        }
      })
  }

  get name_invalid() {
    return this.form.get('name').invalid && this.form.get('name').touched
  }

}
