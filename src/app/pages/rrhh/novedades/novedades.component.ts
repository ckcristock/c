import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import * as moment from 'moment';
import { DisabilityLeavesService } from './disability-leaves.service';
import { PayrollFactorService } from './payroll-factor.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { MatAccordion } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openModal = new EventEmitter<any>()
  form: FormGroup
  people: any[] = [];
  peopleCount: any[] = [];
  peopleSelects: any[] = [];
  loading = false
  paylads: any[] = []
  donwloading = false;

  constructor(
    private _payroll: PayrollFactorService,
    private fb: FormBuilder,
    private _people: PersonService,
    private _swal: SwalService
  ) {

  }
  ngOnInit() {
    this.createFrom()
    this.cargarNovedades()
    this.getPeople()
    this.getTypes()
  }

  download() {
    let params = this.form.value;
    this.donwloading = true;

    this._payroll.download(params).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/excel' });
      let link = document.createElement('a');
      const filename = 'reporte_novedades';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.xlsx`;
      link.click();
      this.donwloading = false;
    },
      (error) => {
        this.donwloading = false;
        this._swal.hardError();
      },
      () => {
        this.donwloading = false;
      });
  }

  openClose() {

    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  cargarNovedades(page = 1) {
    this.count()
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form.value
    }
    this._payroll.getPayrollFactorPeople(params)
      .subscribe((r: any) => {
        this.loading = false;
        this.people = r.data.data
        this.pagination.collectionSize = r.data.total;
      })
  }

  count() {
    this._payroll.count(this.form.value)
      .subscribe((r: any) => {
        this.peopleCount = r.data
        this.paylads = this.peopleCount.reduce(this.reducePayloads, [])
        console.log(this.paylads)
      })
  }
  types: any[] = []
  getTypes() {
    this._payroll.getTypes().subscribe((res: any) => {
      this.types = res.data
    })
  }

  createFrom() {
    let dateStart = moment().startOf("month").format(moment.HTML5_FMT.DATE)
    let dateEnd = moment().endOf("month").format(moment.HTML5_FMT.DATE)
    //novedades del mes actual
    this.form = this.fb.group({
      date_start: [dateStart, Validators.required],
      date_end: [dateEnd, Validators.required],
      personfill: [''],
      type: ['']
    })
  }

  getPeople() {
    this._people.getPeopleIndex().subscribe((r: any) => {
      this.peopleSelects = r.data;
      this.peopleSelects.unshift({ text: 'Todos', value: '' });
    });
  }

  editarNovedad(fact) {
    this.openModal.next({ data: fact })
  }

  get totalVacaciones() {
    return this.paylads.filter(r => r.disability_type == 'Vacaciones').length
  }
  get totalIncapacidades() {
    return this.paylads.filter(r => r.disability_type == 'Incapacidad').length
  }
  get totalLicencias() {
    return this.paylads.filter(r => r.disability_type == 'Licencia').length
  }
  get totalPermisos() {
    return this.paylads.filter(r => r.disability_type == 'Permisos').length
  }
  get totalAbandonos() {
    return this.paylads.filter(r => r.disability_type == 'Abandono').length
  }
  get totalSuspensiones() {
    return this.paylads.filter(r => r.disability_type == 'Suspensión').length
  }

  reducePayloads = (acc, el) => [...acc, ...el.payroll_factors]
}
