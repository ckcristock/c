import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { NegociosService } from '../negocios.service';
import { PersonService } from 'src/app/pages/ajustes/informacion-base/persons/person.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material';
import { PaginatorService } from 'src/app/core/services/paginator.service';

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
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: localStorage.getItem('paginationItemsBudget') || 100,
  }
  constructor(
    private _modal: ModalService,
    private fb: FormBuilder,
    private _negocio: NegociosService,
    private _person: PersonService,
    private _swal: SwalService,
    private router: Router,
    private _paginator: PaginatorService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    if (this.third_party_id) {
      this._modal.open(this.modal, 'xl');
      this.createFormFiltersBudgets();
      this.getPeople();
      this.getPresupuestos();
      this.presupuestosSeleccionados = [];
    } else {
      this._swal.show({
        icon: 'info',
        title: 'Atención',
        text: 'Selecciona un tercero para continuar.',
        showCancel: false
      })
    }
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination);
    localStorage.setItem('paginationItemsBudget', this.pagination.pageSize)
    this.getPresupuestos()
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

  getPresupuestos(): void {
    this.loadingBudgets = true;
    let params = {
      ...this.pagination,
      ...this.form_filters_budget.value,
      third_party_id: this.third_party_id
    }
    this._negocio.getBudgets(params).subscribe((resp: any) => {
      this.presupuestos = resp.data.data;
      this.presupuestos.forEach(pre => {
        this.presupuestosSeleccionados.forEach(bud => {
          if ((this.create ? bud.id : bud.budget_id) == pre.id) {
            pre.selected = true
          }
        });
      });
      this.paginationMaterial = resp.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getPresupuestos()
      }
      this.loadingBudgets = false;
    });
  }

  guardarPresupuesto(item, event) {
    const index = this.presupuestosSeleccionados.findIndex(x => ((this.create ? x.id : x.budget_id) === item.id));
    if (item.selected) {
      if (index === -1) {
        if (!this.create) {
          this.presupuestosSeleccionados.push({
            budget_id: item.id,
            business_budget_id: this.business_id,
            total_cop: item.total_cop
          });
        } else {
          this.presupuestosSeleccionados.push(item)
        }
        item.selected = true
      }
    } else {
      if (index !== -1) {
        this.presupuestosSeleccionados.splice(index, 1);
        item.selected = false
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
          this._negocio.newBusinessBudget(data).subscribe((res: any) => {
            this.update.emit();
            this.getPresupuestos();
            this._modal.close();
            this.presupuestosSeleccionados = [];
            this._swal.show({
              icon: 'success',
              title: 'Presupuestos agregados',
              text: res.data,
              showCancel: false
            })
          });
        }
      })
    } else {
      this.update.emit(this.presupuestosSeleccionados);
      this._modal.close();
    }
  }

  dateChange(e) {
    if (e.value) {
      this.form_filters_budget.patchValue({
        date: new Date(e.value).toISOString()
      })
    } else {
      this.form_filters_budget.patchValue({
        date: ''
      })
    }
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

}
