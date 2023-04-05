import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { TercerosService } from '../terceros.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { debounceTime } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  checkObservacion: boolean = true
  checkPersona: boolean = true
  checkTercero: boolean = true
  checkTelefono: boolean = true
  checkEmail: boolean = true
  checkCargo: boolean = true
  paginacion: any
  estadoFiltros = false;
  matPanel = false;
  matPanel2 = false;
  person: any = {};
  thirds: any[] = []
  closeResult = '';
  form: FormGroup;
  form_filters: FormGroup;
  people: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  orderObj: any
  filtrosActivos: boolean = false
  permission: Permissions = {
    menu: 'Personas',
    permissions: {
      show: true
    }
  };

  constructor(
    private _terceros: TercerosService,
    private modalService: NgbModal,
    private location: Location,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _permission: PermissionService,
    private route: ActivatedRoute,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService,
    private router: Router,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params };
          if (Object.keys(this.orderObj).length > 2) {
            this.filtrosActivos = true
            const formValues = {};
            for (const param in params) {
              formValues[param] = params[param];
            }
            this.form_filters.patchValue(formValues['params']);
          }
          if (this.orderObj.params.pag) {
            this.getPerson(this.orderObj.params.pag);
          } else {
            this.getPerson()
          }
        }
        );
      this.createForm();
      this.getThirds();
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      name: '',
      third: '',
      phone: '',
      email: '',
      cargo: '',
      observacion: '',
      documento: ''
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(r => {
      this.getPerson()
    })
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.firstAccordion.openAll() : this.firstAccordion.closeAll();
  }
  openClose2() {
    this.matPanel2 = !this.matPanel2;
    this.matPanel2 ? this.secondAccordion.openAll() : this.secondAccordion.closeAll();
  }

  personForm(person) {
    this.person = { ...person };
    this.form.patchValue({
      id: this.person.id,
      name: this.person.name,
      n_document: this.person.n_document,
      landline: this.person.landline,
      cell_phone: this.person.cell_phone,
      email: this.person.email,
      position: this.person.position,
      observation: this.person.observation,
      third_party_id: this.person.third_party_id,
    })
  }

  public openConfirm(confirm) {
    this.getThirdsForCreate()
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }
  thirds_aux: any[] = [];
  getThirds() {
    this._terceros.getThirds().subscribe((r: any) => {
      this.thirds = r.data
      this.thirds.unshift({ text: 'Sin tercero', value: null });
      this.thirds.unshift({ text: 'Todos', value: '' });
    })
  }

  getThirdsForCreate() {
    this._terceros.getThirds({ get_full: true }).subscribe((r: any) => {
      this.thirds_aux = r.data;
      this.thirds_aux.unshift({ text: 'Sin tercero', value: null });
    })
  }

  resetFiltros() {
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
    this.filtrosActivos = false
  }

  handlePageEvent(event: PageEvent) {
    this.getPerson(event.pageIndex + 1)
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', this._validators.required],
      n_document: [''],
      landline: [''],
      cell_phone: [''],
      email: ['', Validators.email],
      position: [''],
      observation: [''],
      third_party_id: [null],
    });
  }

  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    for (const controlName in this.form_filters.controls) {
      const control = this.form_filters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  getPerson(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/personas', paramsurl.toString());
    this._terceros.getThirdPartyPerson(params).subscribe((r: any) => {
      this.people = r.data.data;
      this.paginacion = r.data
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  addPerson() {
    if (this.form.valid) {
      this._terceros.addThirdPartyPerson(this.form.value)
        .subscribe((res: any) => {
          this._swal.show({
            title: res.data,
            icon: 'success',
            text: '',
            timer: 1000,
            showCancel: false
          })
          this.getPerson();
          this.modalService.dismissAll();
        });
    } else {
      this.form.touched
      this._swal.show({
        icon: 'error',
        title: 'Tuvimos un problema',
        text: 'Revisa toda la información ingresada y vuelve a intentarlo',
        showCancel: false
      })
    }
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
