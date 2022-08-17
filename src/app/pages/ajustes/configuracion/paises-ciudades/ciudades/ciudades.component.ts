import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadesService } from './ciudades.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.scss']
})
export class CiudadesComponent implements OnInit {
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
  form: FormGroup;
  countries: any[] = [];
  cities: any[] = [];
  city: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    name: '',
    country: ''
  }
  constructor(
    private fb: FormBuilder,
    private _ciudades: CiudadesService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getContries();
    this.getCities();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset()
    
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.city.id],
      name: ['', Validators.required],
      country_id: ['', Validators.required],
      percentage_product: ['', Validators.required],
      percentage_service: ['', Validators.required]
    });
  }

  getContries() {
    this._ciudades.getContries().subscribe((r: any) => {
      this.countries = r.data;
      this.countries.unshift({ text: 'Todos', value: 0 });
    })
  }

  getCity(city) {
    this.city = { ...city };
    this.form.patchValue({
      id: this.city.id,
      name: this.city.name,
      country_id: this.city.country_id,
      percentage_product: this.city.percentage_product,
      percentage_service: this.city.percentage_service
    });
  }

  getCities(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._ciudades.getCities(params).subscribe((r: any) => {
      this.cities = r.data.data;
      console.log(this.cities);

      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    this._ciudades.createCity(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getCities();
      this._swal.show({
        icon: 'success',
        title: '¡Creado!',
        text: 'La ciudad ha sido creada satisfactoriamente',
        showCancel: false
      })
    })
  }

  activateOrInactivate(city, state) {
    let data = {
      id: city.id,
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: "¡La ciudad será desactivada!",
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._ciudades.createCity(data).subscribe((r: any) => {
            this.getCities();
          })
          this._swal.show({
            icon: 'success',
            title: '¡Activada!',
            text: 'La ciudad ha sido activada con éxito.',
            timer: 1000,
            showCancel: false
          })
        }
      })
  }

}
