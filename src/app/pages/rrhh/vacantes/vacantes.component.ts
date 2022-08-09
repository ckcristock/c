import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { JobService } from './job.service';
import Swal from 'sweetalert2';
import { MinicipalityService } from '../../../core/services/municipality.service';
import { DepartmentService } from '../../../core/services/department.service';
import { MatAccordion } from '@angular/material/expansion';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-vacantes',
  templateUrl: './vacantes.component.html',
  styleUrls: ['./vacantes.component.scss']
})

export class VacantesComponent implements OnInit {
  checkCodigo: boolean = true
  checkPublicacion: boolean = true
  checkInicio: boolean = true
  checkFin: boolean = true
  checkTitulo: boolean = true
  checkDependencia: boolean = true
  checkCargo: boolean = true
  checkDepartamento: boolean = true
  checkMunicipio: boolean = true
  checkEstado: boolean = true

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
  pagination = {
    page: 1,
    pageSize: 15,
    collectionSize: 0,
  }
  loading = false;
  timeout: any;
  user: any;
  page = 1;
  filtros = {
    fecha: '',
    fecha_Inicio: '',
    fecha_Fin: '',
    titulo: '',
    dependencia: '',
    cargo: '',
    departamento: '',
    municipio: '',
    estado: '',
  }
  jobs: any = [];
  TotalItems: number;
  municipalities: any[] = [];
  department: any[] = [];
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any
  dependencies: any[] = [];
  positions: any[] = [];
  myDateRangePickerOptions: IMyDrpOptions = {
    width: '100px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  constructor(
    private _job: JobService,
    private _municipatilies: MinicipalityService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private _department: DepartmentService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit() {
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
          this.getJobs(this.orderObj.params.pag);
        } else {
          this.getJobs()
        }

      }
      );
    this.getMunicipalities();
    this.getDepartments();
    this.getDependencies();
    this.getPositions();
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getJobs()
  }

  handlePageEvent(event: PageEvent) {
    console.log(event)
    this.getJobs(event.pageIndex + 1)
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.pag = paginacion;
    for (let i in this.filtros) {
      if (this.filtros[i] != "") {
        params[i] = this.filtros[i];
      }
    }
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }

  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtros.fecha = event;
    } else {
      this.filtros.fecha = '';
    }
  }

  getMunicipalities() {
    this._municipatilies.getMinicipalities().subscribe((r: any) => {
      this.municipalities = r.data;
    })
  }

  getDepartments() {
    this._department.getDepartments().subscribe((r: any) => {
      this.department = r.data;
    })
  }

  getDependencies() {
    this._job.getDependencies().subscribe((r: any) => {
      this.dependencies = r.data;
    })
  }

  getPositions() {
    this._job.getPositions().subscribe((r: any) => {
      this.positions = r.data;
    })
  }

  getJobs(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/vacantes', paramsurl);
    this._job.getJobs(params).subscribe((r: any) => {
      this.jobs = r.data.data;
      console.log(r)
      this.paginacion = r.data
      this.loading = false;
      this.pagination.collectionSize = r.data.total
    })
  }

  cancelar(id) {
    Swal.fire({
      title: '¿Seguro?',
      text: 'Se va a CANCELAR una nueva vacante',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Si, Hazlo!'
    }).then(result => {
      if (result.value) {
        this.sendData(id);
      }
    });

  }

  sendData(id) {
    this._job.setState(id, { state: 'Cancelada' }).subscribe((r: any) => {

      if (r.code == 200) {
        Swal.fire({
          title: 'Creación exitosa',
          text: 'Felicidades, se ha actualizado la vacante',
          icon: 'success',

        })
      }
      this.getJobs();
    });
  }
}
