import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MunicipiosService } from './municipios.service';

@Component({
  selector: 'app-municipios',
  templateUrl: './municipios.component.html',
  styleUrls: ['./municipios.component.scss']
})
export class MunicipiosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }    
  }
  loading: boolean = false;

  municipios: any = [];
  munic: any = [];
  municipality: any = {};

  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }

  filtro: any = {
    code: '',
    name: '',
    department: ''
  }

  constructor(private municipioService: MunicipiosService, private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getAllMunicipalities();
    this.getMunicipalities();
  }


  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    department_id: new FormControl('', [Validators.required]),
    code_dane: new FormControl('', [Validators.required])
  });

  createNewMunicipality() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    this.municipioService.createNewMunicipality(this.municipality)
      .subscribe((res: any) => {
        if (res.code === 200) {
          this.getAllMunicipalities();
          this.modalService.dismissAll();
          Swal.fire({
            title: 'Operación exitosa',
            text: 'Felicidades, se ha registrado el nuevo Municipio',
            icon: 'success',
            allowOutsideClick: false,
            allowEscapeKey: false
          })
        } else {
          Swal.fire({
            title: 'UPS',
            text: 'Algunos datos ya existen en la base de datos',
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false
          })
        }
      });
  }
  /* Función para llevar los departamentos al select del formulario */
  getMunicipalities() {
    this.municipioService.getAllMunicipalities()
      .subscribe((res: any) => {
        this.munic = res.data;
      });
  }

  openModalM() {

    this.modal.show();

  }

  closeResult = '';
  public openConfirm(confirm) {
    this.municipality.name = '';
    this.municipality.code = '';
    this.municipality.department_id = '';
    this.municipality.codigo_dane = '';
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllMunicipalities(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this.municipioService.getMunicipalityPaginate(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.municipios = res.data.data;

        this.pagination.collectionSize = res.data.total;
      });
  }

  get name_municipality() {
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

  get code_municipality() {
    return (
      this.form.get('code').invalid && this.form.get('code').touched
    )
  }

  get department_municipality() {
    return (
      this.form.get('department_id').invalid && this.form.get('department_id').touched
    )
  }

  get code_dane_municipality() {
    return (
      this.form.get('code_dane').invalid && this.form.get('code_dane').touched
    )
  }

}
