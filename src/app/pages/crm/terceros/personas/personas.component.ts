import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { TercerosService } from '../terceros.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  checkPersona: boolean = true
  checkTercero: boolean = true
  checkTelefono: boolean = true
  checkEmail: boolean = true
  checkCargo: boolean = true
  checkObservacion: boolean = true
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }


  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }
  form: FormGroup;
  people: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    third: '',
    phone: '',
    email: '',
    cargo: '',
    observacion: '',
    documento: ''
  }
  constructor(
    private _terceros: TercerosService,
    private modalService: NgbModal,
    private location: Location,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private route: ActivatedRoute,
    private paginator: MatPaginatorIntl,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }
  orderObj: any
  filtrosActivos: boolean = false
  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.orderObj = { ...params.keys, ...params };
        for (let i in this.orderObj.params) {
          if (this.orderObj.params[i]) {
            if (Object.keys(this.orderObj).length > 2) {
              this.filtrosActivos = true
            }
            this.filtros[i] = this.orderObj.params[i]

          }
        }

        if (this.orderObj.params.pag) {
          this.getPerson(this.orderObj.params.pag);
        } else {
          this.getPerson()
        }

      }
      );
    this.createForm();
  }
  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getPerson()
  }

  paginacion: any
  handlePageEvent(event: PageEvent) {
    console.log(event)
    this.getPerson(event.pageIndex + 1)
  }
  estadoFiltros = false;

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', this._validators.required],
      n_document: ['', this._validators.required],
      landline: [''],
      cell_phone: [''],
      email: ['', Validators.email],
      position: [''],
      observation: [''],
    });
  }

  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.pag = paginacion;
    for (let i in this.filtros){
      if (this.filtros[i] != "") {
        params[i] = this.filtros[i];
      }
    }
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }
  
  getPerson(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/personas', paramsurl);
    this._terceros.getThirdPartyPerson(params).subscribe((r: any) => {
      this.people = r.data.data;
      this.paginacion = r.data
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  addPerson() {
    this._terceros.addThirdPartyPerson(this.form.value)
      .subscribe((res: any) => {
        swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado la persona con éxito.'
        });
        this.getPerson();
        this.modalService.dismissAll();
      });
  }

  get name_valid() {
    return this.form.get('name').invalid && this.form.get('name').touched
  }
  get n_document_valid() {
    return this.form.get('n_document').invalid && this.form.get('n_document').touched
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched
  }
}
