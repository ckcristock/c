import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegociosService } from '../negocios.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { DomSanitizer } from '@angular/platform-browser';
import { QuotationService } from '../../cotizacion/quotation.service';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
@Component({
  selector: 'app-ver-negocio',
  templateUrl: './ver-negocio.component.html',
  styleUrls: ['./ver-negocio.component.scss'],
})
export class VerNegocioComponent implements OnInit {
  @ViewChild('modalCotizaciones') modalCotizaciones: any;
  @ViewChild('apus') apus: any
  active = 1;
  loading: boolean;
  contactos: any[];
  negocio: any;
  person_id;
  people: any[] = []
  presupuestos: any[];
  presupuestosSeleccionados: any[] = [];
  cotizaciones: any;
  cotizacionesSeleccionadas: any[] = [];
  apuSelected: any[] = [];
  business_budget_id: any = '';
  qr;
  loadingBudgets: boolean;
  loadingQuotation: boolean;
  filtros = {
    id: '',
  };
  paginationQuotations: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  paginationBudgets: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  form_filters_budget: FormGroup;
  form_filters_quotations: FormGroup;
  form_notes: FormGroup;
  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService,
    private _modal: ModalService,
    private _sanitizer: DomSanitizer,
    private _quotation: QuotationService,
    private _user: UserService,
    private _swal: SwalService,
    private _person: PersonService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filtros.id = this.ruta.snapshot.params.id;
    this.person_id = this._user.user.person.id
  }

  ngOnInit(): void {
    this.getBussines();
    this.createFormFiltersBudgets();
    this.createFormFiltersQuotations();
    this.createFormNotes();
    this.getPeople();
  }

  async getApus(e: any[]) {
    await e.forEach(apu => {
      const exist = this.negocio['apus'].some(x => (x.apuable_id == apu.apu_id && x.apuable.typeapu_name == apu.type_name))
      if (!exist) {
        this.apuSelected.push(apu)
      } else {
        this._swal.show({ icon: 'error', title: 'Error', text: 'Ya agregaste este APU', showCancel: false })
      }
    }, Promise.resolve());
    this.addApu()
  }

  addApu() {
    let data = {
      business_id: this.filtros.id,
      apus: this.apuSelected,
      person_id: this.person_id
    }
    this._negocio.newBusinessApu(data).subscribe(data => {
      this.getBussines();
      this.apuSelected = [];
    });
  }

  findApus() {
    this.apus.openConfirm()
  }

  changeState(event) {
    this._negocio.changeState({ status: event.value }, this.filtros.id).subscribe(() => {
      this._swal.show({
        icon: 'success',
        title: 'Operación exitosa',
        text: 'Etapa cambiada con éxito',
        showCancel: false,
        timer: 1000
      })
    });
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  createFormFiltersBudgets() {
    this.form_filters_budget = this.fb.group({
      code: '',
      date: '',
      customer: '',
      municipality_id: '',
      line: '',
      person_id: ''
    })
    this.form_filters_budget.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getPresupuestos();
    })
  }

  createFormFiltersQuotations() {
    this.form_filters_quotations = this.fb.group({
      city: '',
      code: '',
      client: '',
      description: '',
      line: '',
    })
    this.form_filters_quotations.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getQuotations();
    })
  }

  createFormNotes() {
    this.form_notes = this.fb.group({
      person_id: [this.person_id],
      note: ['', [Validators.required, Validators.maxLength(500)]],
      business_id: [this.filtros.id]
    });
  }

  saveNote() {
    if (this.form_notes.valid) {
      this._negocio.newNote(this.form_notes.value).subscribe(
        (res: any) => {
          this.form_notes.patchValue({
            note: ''
          })
          this._swal.show({
            icon: 'success',
            title: res.data,
            text: '',
            showCancel: false,
            timer: 1000
          })
        }
      )
      this._negocio.getNotes(this.filtros.id).subscribe((res: any) => {
        this.negocio.notes = res.data[0]
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'No puedes publicar una nota vacía o con más de 500 caracteres',
        showCancel: false
      })
    }

  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'xl')
  }

  changeStatusInBusiness(status, item, label) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'Vamos a cambiar el estado. ' +
        ((status == 'Aprobado' || status == 'Aprobada') ?
          ('Al aprobar ' + (label == 'quotation' ? 'una cotización' : 'un presupuesto') + ' el resto se rechazarán automáticamente.') : ''),

    }).then(r => {
      if (r.isConfirmed) {
        let data = {
          item: item,
          status: status,
          label: label
        }
        this._negocio.changeStatusQyB(data).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Correcto',
            text: 'Se ha cambiado el estado correctamente',
            showCancel: false,
            timer: 1000
          })
          this.getBussines()
        })
      }
    })
  }

  getBussines() {
    this.loading = true;
    this._negocio.getBusiness(this.filtros.id).subscribe((res: any) => {
      this.qr = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + res.code)
      this.negocio = res.data;
      this.loading = false;
    })
    this.business_budget_id = this.ruta.snapshot.params.id;
  }

  getPresupuestos(page = 1) {
    this.presupuestosSeleccionados = []
    this.paginationBudgets.page = page;
    let params = {
      ...this.paginationBudgets,
      ...this.form_filters_budget.value,
      third_party_id: this.negocio.third_party_id
    }
    this.loadingBudgets = true;
    this._negocio.getBudgets(params).subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      this.paginationBudgets.collectionSize = resp.data.total;
      this.loadingBudgets = false
    });
  }

  guardarPresupuesto(id, total_cop?) {
    if (this.presupuestosSeleccionados.includes(id))
      this.presupuestosSeleccionados = this.presupuestosSeleccionados.filter(
        (pres) => pres !== id
      );
    else this.presupuestosSeleccionados.push({
      budget_id: id,
      business_budget_id: this.ruta.snapshot.params.id,
      total_cop: total_cop
    });
  }

  guardarCotizacion(id, total_cop) {
    if (this.cotizacionesSeleccionadas.includes(id))
      this.cotizacionesSeleccionadas = this.cotizacionesSeleccionadas.filter(
        (cot) => cot !== id
      );
    else this.cotizacionesSeleccionadas.push({
      quotation_id: id,
      business_id: this.ruta.snapshot.params.id,
      total_cop: total_cop
    });
  }

  quotations: any[] = []
  getQuotations(page = 1) {
    this.cotizacionesSeleccionadas = []
    this.paginationQuotations.page = page;
    let params = {
      ...this.paginationQuotations,
      ...this.form_filters_quotations.value,
      third_party_id: this.negocio.third_party_id
    }
    this.loadingQuotation = true;
    this._quotation.getQuotations(params).subscribe((res: any) => {
      this.quotations = res.data.data;
      this.loadingQuotation = false;
      this.paginationQuotations.collectionSize = res.data.total;
    })
  }

  addCotizacion() {
    let data = {
      business_id: this.filtros.id,
      quotations: this.cotizacionesSeleccionadas,
      person_id: this.person_id
    }
    this._negocio.newBusinessQuotation(data).subscribe(data => {
      this.getBussines();
      this.getQuotations();
      this._modal.close();
      this.cotizacionesSeleccionadas = [];
    });
  }



  obtenerContactos(thirdCompany: string) {
    let params = {
      third: thirdCompany,
    };

    this._negocio.getThirdPartyPerson(params).subscribe((resp: any) => {
      this.contactos = resp.data;
    });
  }

  saveBudget() {
    let data = {
      business_id: this.filtros.id,
      budgets: this.presupuestosSeleccionados,
      person_id: this.person_id
    }
    this._negocio.newBusinessBudget(data).subscribe(data => {
      this.getBussines();
      this.getPresupuestos();
      this._modal.close();
      this.presupuestosSeleccionados = [];
    });
  }

  closeModalCotizaciones() {
    this.negocio.cotizaciones = this.cotizacionesSeleccionadas;
  }

}
