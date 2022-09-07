import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { PositionService } from '../../ajustes/informacion-base/services/positions.service';
import { ContratosService } from './contratos.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
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
  contractData: boolean;
  contracts: any[] = [];
  groups: any[];
  loading = false;
  contractsTrialPeriod: any = [];
  contractsToExpire: any = [];
  dependencies: any[];
  positions: any[];
  companies: any[] = [];
  orderObj: any
  filtrosActivos: boolean = false
  paginacion: any
  paginacion2: any
  pagination: any = {
    pageSize: 12,
    page: 1,
    collectionSize: 0
  }
  paginationCV: any = {
    pageSize: 7,
    page: 1,
    collectionSize: 0
  }
  filtros: any = {
    company: '',
    person: '',
    dependency: '',
    position: '',
    group: ''
  }
  constructor(
    private contractService: ContratosService,
    private _group: GroupService,
    private _positions: PositionService,
    private _dependecies: DependenciesService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  ngOnInit(): void {
    this.getGroups();
    this.getDependencies();
    this.getPositions();
    this.getCompanies();
    this.getContractsToExpire();
    this.getContractByTrialPeriod();
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
          this.getAllContracts(this.orderObj.params.pag);
        } else {
          this.getAllContracts()
        }
      }
      );
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
    this.getAllContracts()
  }

  handlePageEvent(event: PageEvent) {
    this.getAllContracts(event.pageIndex + 1)
  }
  handlePageEvent2(event: PageEvent) {
    this.getContractsToExpire(event.pageIndex + 1)
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
  getAllContracts(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/rrhh/contratos', paramsurl);
    this.loading = true;
    this.contractService.getAllContracts(params)
      .subscribe((res: any) => {
        this.contracts = res.data.data;
        console.log(this.contracts)
        this.paginacion = res.data
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
      });
  }

  getCompanies() {
    this.contractService.getCompanies()
      .subscribe((res: any) => {
        this.companies = res.data;
      });
  }

  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data
      //this.groups.unshift({ text: 'Seleccione uno', value: '' });
    })
  }

  getDependencies() {
    this.contractService.getDependencies().subscribe((d: any) => {
      this.dependencies = d.data;
      //this.dependencies.unshift({ text: 'Seleccione una', value: '' });
    });
  }

  getPositions() {
    this.contractService.getPositions().subscribe((d: any) => {
      this.positions = d.data;
      //this.positions.unshift({ text: 'Seleccione una', value: '' });
    });
  }

  getContractsToExpire(page = 1) {
    this.contractData = true
    this.paginationCV.page = page;
    this.contractService.getContractsToExpire(this.paginationCV)
      .subscribe((res: any) => {
        this.contractsToExpire = res.data.data;
        console.log(this.contractsToExpire)
        this.paginationCV.collectionSize = res.data.total;
        this.paginacion2 = res.data
        this.contractData = false
      });
  }

  download(id, funcionario) {
    funcionario = Object.entries(funcionario)
    let params = {id: id, funcionario }
    this.contractService.download(params).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = name + '.pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
    },
      (error) => {
        console.log('Error downloading the file');
      },
      () => {
        console.info('File downloaded successfully');
      })
  }

  getContractByTrialPeriod() {
    this.contractService.getContractByTrialPeriod()
      .subscribe((res: any) => {
        this.contractsTrialPeriod = res.data;
      })
  }

}
