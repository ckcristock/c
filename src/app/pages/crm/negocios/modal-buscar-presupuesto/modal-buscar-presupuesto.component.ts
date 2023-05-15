import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { NegociosService } from '../negocios.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-buscar-presupuesto',
  templateUrl: './modal-buscar-presupuesto.component.html',
  styleUrls: ['./modal-buscar-presupuesto.component.scss']
})
export class ModalBuscarPresupuestoComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @Input('third_party_id') third_party_id;
  @Input('business_id') business_id;
  @Input('person_id') person_id;
  @Input('create') create: boolean;
  @Output('update') update = new EventEmitter();
  form_filters_budget: FormGroup;
  presupuestosSeleccionados: any[] = [];
  presupuestos: any[] = [];
  people: any[] = [];
  loadingBudgets: boolean;
  paginationBudgets: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocio: NegociosService,
    private _person: PersonService,
    private _swal: SwalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    if (this.third_party_id) {
      this._modal.open(this.modal, 'xl');
      this.createFormFiltersBudgets();
      this.getPeople();
      this.getPresupuestos();
    } else {
      this._swal.show({
        icon: 'info',
        title: 'Atención',
        text: 'Selecciona un tercero para continuar.',
        showCancel: false
      })
    }
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

  getPeople() {
    this._person.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos ', value: '' });
    })
  }

  getPresupuestos(page = 1) {
    this.presupuestosSeleccionados = []
    this.paginationBudgets.page = page;
    let params = {
      ...this.paginationBudgets,
      ...this.form_filters_budget.value,
      third_party_id: this.third_party_id
    }
    this.loadingBudgets = true;
    this._negocio.getBudgets(params).subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      this.paginationBudgets.collectionSize = resp.data.total;
      this.loadingBudgets = false
    });
  }

  guardarPresupuesto(item) {
    if (this.presupuestosSeleccionados.includes(item.id)) {
      this.presupuestosSeleccionados = this.presupuestosSeleccionados.filter(
        (pres) => pres !== item.id
      );
    }
    else {
      if (!this.create) {
        this.presupuestosSeleccionados.push({
          budget_id: item.id,
          business_budget_id: this.business_id,
          total_cop: item.total_cop
        });
      } else {
        this.presupuestosSeleccionados.push(item)
      }
    }
  }

  saveBudget() {
    if (!this.create) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a agregar los presupuestos seleccionados'
      }).then(r => {
        if (r.isConfirmed) {
          let data = {
            business_id: this.business_id,
            budgets: this.presupuestosSeleccionados,
            person_id: this.person_id
          }
          this._negocio.newBusinessBudget(data).subscribe(data => {
            this.update.emit();
            this.getPresupuestos();
            this._modal.close();
            this.presupuestosSeleccionados = [];
          });
        }
      })
    } else {
      this.update.emit(this.presupuestosSeleccionados);
      this._modal.close();
    }
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

}
