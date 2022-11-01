import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaisesService } from "../paises-ciudades/paises/paises.service";
import { DepartamentosService  } from "../departamentos-municipios/departamentos/departamentos.service";
import { CiudadesService } from "../paises-ciudades/ciudades/ciudades.service";
import { SwalService } from "../../../../pages/ajustes/informacion-base/services/swal.service";
import { showConfirm } from 'src/app/core/utils/confirmMessage';
import { MunicipiosService } from '../departamentos-municipios/municipios/municipios.service';
import { MatTableDataSource } from '@angular/material';
import { param } from 'jquery';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('modal') modal: any

  countries: any[] = [];
  states: any[] = [];
  municipalities: any[] = [];
  cities: any[] = [];

  filtro_pais: any = {
    name: ''
  }
  filtro_depto: any = {
    name: ''
  }
  filtro_muni: any = {
    name: ''
  }
  filtro_ciud: any = {
    name: ''
  }

  pagination_pais: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  pagination_depto: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  pagination_muni: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  pagination_ciud: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  loadingCountry: boolean = true;
  loadingState: boolean = true;
  loadingCity: boolean = true;
  loadingMunicipality: boolean = true;

  name = ''
  tipo = ''
  id = ''
  operation = ''
  dian_code = ''
  dane_code = ''

  countrySelected:any = 0; //se toma el id=1 para el país Colombia
  municipalitySelected: any = 0;
  stateSelected:any = 0;

  dataSource = new MatTableDataSource();

  constructor(
    private _countries: PaisesService,
    private _state: DepartamentosService,
    private _cities: CiudadesService,
    private _municipality: MunicipiosService,
    private modalService: NgbModal,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getCountries();
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

  }

  openModal(tipo, add) {
    this.name = ''
    this.id = '';
    this.dane_code = '';
    this.dian_code = '';
    this.operation = 'guardar';
    this.tipo = tipo;
    this.openConfirm(add)
  }

  editar(tipo, modelo, add) {
    this.name = modelo.name
    this.dian_code = modelo.dian_code
    this.dane_code = modelo.dane_code
    this.openConfirm(add)
    this.tipo = tipo
    this.operation = 'editar';
    this.id = modelo.id
  }

  getCountries(page = 1) {
    this.pagination_pais.page = page;
    let params = {
      ...this.pagination_pais, ...this.filtro_pais
    }
    this.loadingCountry = true;
    this._countries.getCountries(params).subscribe((r:any) => {
      this.countries = r.data.data;
      this.pagination_pais.collectionSize = r.data.total;
      if (this.countries.length > 0) {
        this.countries[0].selected = true;
        this.getStates(this.countries[0].id);
      }
      this.loadingCountry = false;
    });
  }

  getStates(country_id, page = 1){
    //hace la consulta de acuerdo al país seleccionado
    this.pagination_depto.page = page;
    let params = {
      ...this.pagination_depto, ...this.filtro_depto
    }
    this.loadingState = true
    this.countrySelected = country_id
    this._state.getDepartmentById(this.countrySelected, params)
    .subscribe((r:any)=>{
        this.states = r.data.data;
        this.pagination_depto.collectionSize = r.data.total;
        if (this.states.length > 0) {
          this.states[0].selected = true;
            if(this.countrySelected == 1) {
              this.getMunicipalities(this.states[0].id);
            } else {
              this.getCities(this.states[0].id);
            }
        }
      if (r.data.total == 0) {
        this.municipalities = [];
        this.cities = [];
      }
      this.loadingState = false
    })
  }

  getMunicipalities(state_id, page = 1) {
    this.pagination_muni.page = page;
    let params = {
      ...this.pagination_muni, ...this.filtro_muni
    }
    this.loadingMunicipality = true;
    this.stateSelected = state_id
    this._municipality.getAllMunicipalitiesByDepartment(this.stateSelected, params)
      .subscribe((r:any)=>{
        this.municipalities = r.data.data;
        this.pagination_muni.collectionSize = r.data.total;
        if (this.municipalities.length != 0) {
          this.municipalities[0].selected = true;
          this.getCitiesByMunicipality(this.municipalities[0].id);
        }
        if (r.data.total == 0) {
          this.municipalities = [];
          this.cities = [];
        }
      })
    this.loadingMunicipality = false;
  }

  getCitiesByMunicipality(municipality_id: any, page = 1){
    //hace la consulta de acuerdo al municipio seleccionado (solo si es Colombia)
    this.pagination_ciud.page = page;
    let params = {
      ...this.pagination_ciud, ...this.filtro_ciud
    }
    this.loadingCity = true;
    this.municipalitySelected = municipality_id;
    this._cities.getCitiesByMunicipalityId(this.municipalitySelected, params)
    .subscribe((r:any)=>{
        this.cities = r.data.data;
        if (r.data.total>0) {
          this.cities[0].selected = true;
        }
        this.pagination_ciud.collectionSize = r.data.total;

      this.loadingCity = false;
    })
  }

  getCities(state_id, page = 1){
    //hace la consulta de acuerdo al estado/departamento seleccionado
    this.pagination_ciud.page = page;
    let params = {
      ...this.pagination_ciud, ...this.filtro_ciud
    }
    this.loadingCity = true;
    this.stateSelected = state_id;
    this._cities.getCitiesByStateId(this.stateSelected, params)
    .subscribe((r:any)=>{
      this.cities = r.data.data
      if (this.cities.length > 0){
        this.cities[0].selected = true;
      }
      this.loadingCity = false;
    })
  }

  selected(model, value){
    model = model.map(m=>{
      m.selected = m.id == value ? true : false;
    })
  }

  getSwal(title, text, icon, showCancel){
    this._swal.show({
      title,
      text,
      icon,
      showCancel
    }, false)
  }

  delete(tipo, id){ //no se está usando
    if(tipo == 'paises'){
      this._countries.delete(id).subscribe(r => {
        this.getStates(1)
        this.deleteSwal.show();
      })
    }
    if(tipo == 'departamentos'){
      this._state.delete(id).subscribe(r =>{
        this.getStates(1)
        this.deleteSwal.show();
      })
    }
    if(tipo == 'municipios'){
      let data = {'active': false};
      this._municipality.delete(id, data).subscribe(r =>{
        this.getMunicipalities(1)
        this.deleteSwal.show();
      })
    }
    if(tipo == 'ciudades'){
      this._cities.delete(id).subscribe(r =>{
        this.getCountries()
        this.deleteSwal.show();
      })
    }
  }

  save() {
    if (this.tipo == 'ciudades') {
      let selected = this.states.find(r => r.selected == true);
      let params: any = {
        department_id: selected.id,
        name: this.name,
        dian_code: this.dian_code,
        dane_code: this.dane_code
      }
      if (this.countrySelected==1){
        //si existe municipio, guardar el municipio_id
        let selectedMun = this.municipalities.find(r => r.selected == true);
        params.municipality_id = selectedMun.id;
      }
      params ? params.id = this.id : ''
      this.saveCity(params)
    }
    if (this.tipo == 'municipios') {
      let selected = this.states.find(r => r.selected == true);
      let params: any = {
        department_id: selected.id,
        name: this.name.toUpperCase(),
        dian_code: this.dian_code,
        dane_code: this.dane_code
      }
      params ? params.id = this.id : ''
      this.saveMunicipality(params)
    }
    if (this.tipo == 'departamentos') {
      let selected = this.countries.find(r => r.selected == true);
      let params: any = {
        country_id: selected.id,
        name: this.name.toUpperCase(),
        dian_code: this.dian_code,
        dane_code: this.dane_code
      }
      params ? params.id = this.id : ''
      this.saveState(params)
    }
    if (this.tipo == 'paises') {
      let params: any = {
        name: this.name,
        dian_code: this.dian_code,
        dane_code: this.dane_code
      }
      params ? params.id = this.id : ''
      this.saveCountry(params);
    }
  }

  saveCountry(params) {
    this._countries.createCountry(params).subscribe((r:any) => {
      if(r.status==false){
        this.getSwal('Error en País', r.err, 'error', false);
      } else {
        this.getSwal('País', r.data, 'success' ,false);
      }
      this.getCountries()
      this.modalService.dismissAll();
    })
  }
  saveState(params) {
    this._state.setDepartment(params).subscribe((r: any) => {
      if(r.status==false){
        this.getSwal('Error en Departamento', r.err, 'error', false);
      } else {
        this.getSwal('Departamento', r.data, 'success' ,false);
      }
      this.getStates(params.country_id);
      this.getSwal('Departamento/Estado', r.data, 'success', false);
      this.modalService.dismissAll();
    })
  }
  saveMunicipality(params: any){
    this._municipality.createNewMunicipality(params). subscribe((r:any)=>{
      if(r.status==false){
        this.getSwal('Error en Municipio', r.err, 'error', false);
      } else {
        this.getSwal('Municipio agregado', r.data, 'success' ,false);
      }
      this.getMunicipalities(params.department_id);
      this.getSwal('Municipio agregado', r.data, 'success', false);
      this.modalService.dismissAll();
    })   ////revisar que el servicio agregue y modifique al mismo tiempo
  }
  saveCity(params) {
    this._cities.createCity(params).subscribe((r: any) => {
      if(r.status==false){
        this.getSwal('Error en Ciudad', r.err, 'error', false);
      } else {
        this.getSwal('Ciudad agregada', r.data, 'success' ,false);
      }
      this.getCities(params.department_id);
      this.getSwal('Ciudad agregada', r.data, 'success' ,false);
      this.modalService.dismissAll();
    })
  }


}
