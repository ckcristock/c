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
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FixedTurnService } from '../../ajustes/informacion-base/turnos/turno-fijo/turno-fijo.service';
import { RotatingTurnService } from '../../ajustes/informacion-base/turnos/turno-rotativo/rotating-turn.service';

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
  formContrato: FormGroup;
  contractData: boolean;
  contracts: any[] = [];
  groups: any[];
  loading = false;
  listaTiposTurno: any = [];
  listaTurnos: any = [];
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
    private _dependencies: DependenciesService,
    private _modal: ModalService,
    private _fixedTurns: FixedTurnService,
    private _rotatingTurs: RotatingTurnService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
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
    this.route.queryParamMap.subscribe((params) => {
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
    });
    this.getTurnTypes();
  }

  getTurnTypes() {
    this.contractService.getTurnTypes().subscribe((res: any) => {
      this.listaTiposTurno = res.data;
    });
  }

  getTurnsbyType(turnType: string) {
    this.listaTurnos=[];
    if(turnType=="Fijo"){
      this._fixedTurns.getFixedTurns().subscribe((res: any) => {
        res.data.data.forEach(data => {
          this.listaTurnos.push({"id":"TF"+data.value,"name":data.text});
        });
      });
    }else{
      this._rotatingTurs.getAllCreate().subscribe((res: any) => {
        res.data.forEach(data => {
          this.listaTurnos.push({"id":"TR"+data.id,"name":data.name});
        });
      });
    }
  }

  calcularDias(event){
    let date = new Date(event.target.value);
    let dateInicio = new Date(this.formContrato.get('date_of_admission').value);
    let numDias =  Math.floor((date.getTime() - dateInicio.getTime()) / (1000 * 60 * 60 * 24));
    console.log("Días: ", numDias);
    this.formContrato.get('date_diff').setValue(numDias);
  }

  calcularFecha(event){
    let dateInicio = new Date(this.formContrato.get('date_of_admission').value);
    dateInicio.setDate(dateInicio.getDate() + parseInt(event.target.value));
    console.log("Fecha: ", dateInicio.toISOString().split('T')[0]);
    this.formContrato.get('date_end').setValue(dateInicio.toISOString().split('T')[0]);
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

  getDependenciesByGroup(group_id) {
    this._dependencies.getDependencies({ group_id }).subscribe((r: any) => {
      this.dependencies = r.data;
    });
  }

  getPositionsByDependency(dependency_id) {
    this._positions.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data
    });
  }

  getContractsToExpire(page = 1) {
    this.contractData = true
    this.paginationCV.page = page;
    this.contractService.getContractsToExpire(this.paginationCV)
      .subscribe((res: any) => {
        this.contractsToExpire = res.data.data;
        this.paginationCV.collectionSize = res.data.total;
        this.paginacion2 = res.data
        this.contractData = false
      });
  }

  download(id) {
    this.contractService.download(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'contrato' + '.pdf';
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

  // Se toma la decisión de si se renueva al contraro on se liquida.
  makeChoice(employee, modal) {
    (async () => {
      const { value: choice } = await Swal.fire({
        title: `Seleccione qué acción se tomará sobre el contrato de ${employee.first_name+' '+employee.first_surname}.`,
        icon: 'question',
        input: 'radio',
        inputOptions: {
          'true': 'Renovar',
          'false': 'Liquidar'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar una acción!'
          }
        }
      })

      if (choice) {
        if (choice=='true') {
          this.contractService.getContract(employee.id).subscribe((res: any) => {
            res.data['codigo']="CON"+res.data.id;
            if(res.data.turn_type=="Fijo"){
              res.data['turn_id']="TF"+res.data.fixed_turn_id;
              res.data['turn_name']=res.data.fixed_turn_name;
            }else{
              res.data['turn_id']="TR"+res.data.rotating_turn_id;
              res.data['turn_name']=res.data.rotating_turn_name;
            }
            delete res.data.rotating_turn_id;
            delete res.data.rotating_turn_name;
            delete res.data.fixed_turn_id;
            delete res.data.fixed_turn_name;
            const formVacio = Object.fromEntries(
              Object.entries(res.data)
              .map(([ key ]) => [ key,  ['',Validators.required] ])
            );
            this.formContrato = this.fb.group(formVacio);
            this.getDependenciesByGroup(res.data.group_id);
            this.getPositionsByDependency(res.data.dependency_id);
            this.formContrato.patchValue(res.data);
            this.getTurnsbyType(res.data.turn_type);
            this._modal.open(modal);
          })
        }else{
          Swal.fire({ html: `El contrato será liquidado el día ${employee.date_end}.` });
        }
      }
    })()
  }

}
