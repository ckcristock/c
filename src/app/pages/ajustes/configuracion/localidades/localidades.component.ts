import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaisesService } from "../paises-ciudades/paises/paises.service";
import { DepartamentosService  } from "../departamentos-municipios/departamentos/departamentos.service";
import { CiudadesService } from "../paises-ciudades/ciudades/ciudades.service";
import { SwalService } from "../../../../pages/ajustes/informacion-base/services/swal.service";
import { showConfirm } from 'src/app/core/utils/confirmMessage';
import { MunicipiosService } from '../departamentos-municipios/municipios/municipios.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('modal') modal: any

  countries: any[];
  states: any[];
  municipalities: any[];
  cities: any[];

  loadingCountry: boolean = false;
  loadingState: boolean = false;
  loadingCity: boolean = false;
  loadingMunicipality: boolean = false;

  name = ''
  tipo = ''
  id = ''
  operation = ''

  countrySelected:any = 0; //se toma el id=1 para el país Colombia
  municipalitySelected: any = 0;
  stateSelected:any = 0;

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
    this.operation = 'guardar';
    this.tipo = tipo;
    this.openConfirm(add)
  }

  editar(tipo, modelo, add) {
    this.name = modelo.text
    this.openConfirm(add)
    this.tipo = tipo
    this.operation = 'editar';
    this.id = modelo.value
  }

  getCountries() {
    this.loadingCountry = true;
    this._countries.getAllCountries().subscribe((r:any) => {
      this.countries = r.data;
      if (this.countries) {
        this.getStates(this.countries[0].value);
        this.countries[0].selected = true;
      }
      this.loadingCountry = false;
    });
  }

  getStates(country_id){
    //hace la consulta de acuerdo al país seleccionado
    this.loadingState = true
    this.countrySelected = country_id
    this._state.getDepartmentById(this.countrySelected)
    .subscribe((r:any)=>{
      if (r.status == true) {
        this.states = r.data;
        if (this.states != null && this.countrySelected != 1) {
          this.getCities(this.states[0].value);
          this.states[0].selected = true;
        } else {
          this.getMunicipalities(this.states[0].value);
          this.states[0].selected = true;
        }
      }
      if (r.status == false) {
        this.states = null;
        this.cities = null;
      }
      this.loadingState = false
    })
  }

  getMunicipalities(state_id) {
    this.loadingMunicipality = true;
    this.stateSelected = state_id
    this._municipality.getAllMunicipalitiesByDepartment(this.stateSelected)
      .subscribe((r:any)=>{
        if (r.status == true) {
          this.municipalities = r.data;
          if (this.municipalities != null) {
            this.getCitiesByMunicipality(this.states[0].value);
            this.municipalities[0].selected = true;
          }
        }
        if (r.status == false) {
          //this.getSwal('Error en Municipio', r.err, 'error', false);
          this.municipalities = null;
          this.cities = null;
        }
      })

    this.loadingMunicipality = false;
  }

  getCitiesByMunicipality(municipality_id: any){
    //hace la consulta de acuerdo al municipio seleccionado (solo si es Colombia)
    this.loadingCity = true;
    this.municipalitySelected = municipality_id;
    this._cities.getCitiesByMunicipalityId(this.municipalitySelected)
    .subscribe((r:any)=>{
      if(r.status==true){
        this.cities = r.data
        if(this.cities){
          this.cities[0].selected = true;
        }
      } else {
        this.cities = null;
      }
      this.loadingCity = false;
    })
  }

  getCities(state_id){
    //hace la consulta de acuerdo al estado/departamento seleccionado
    this.loadingCity = true;
    this.stateSelected = state_id;
    this._cities.getCitiesByStateId(this.stateSelected)
    .subscribe((r:any)=>{
      if(r.status==true){
        this.cities = r.data
        if(this.cities){
          this.cities[0].selected = true;
        }
      } else {
        this.cities = null;
      }
      this.loadingCity = false;
    })
  }

  selected(model, value){
    model = model.map(m=>{
      m.selected = m.value == value ? true : false;
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

  delete(tipo, id){
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
      let params: any = { department_id: selected.value, name: this.name }
      if (this.countrySelected==1){
        //si existe municipio, guardar el municipio_id
        let selectedMun = this.municipalities.find(r => r.selected == true);
        params.municipality_id = selectedMun.value;
      }
      params ? params.id = this.id : ''
      this.saveCity(params)
    }
    if (this.tipo == 'municipios') {
      let selected = this.states.find(r => r.selected == true);
      let params: any = { department_id: selected.value, name: this.name.toUpperCase() }
      params ? params.id = this.id : ''
      this.saveMunicipality(params)
    }
    if (this.tipo == 'departamentos') {
      let selected = this.countries.find(r => r.selected == true);
      let params: any = { country_id: selected.value, name: this.name.toUpperCase() }
      params ? params.id = this.id : ''
      this.saveState(params)
    }
    if (this.tipo == 'paises') {
      let params: any = { name: this.name }
      params ? params.id = this.id : ''
      this.saveCountry(params);
    }
  }

  saveCountry(params) {
    this._countries.createCountry(params).subscribe((r:any) => {
      if(r.status==false){
        this.getSwal('Error en País', r.err, 'error', false);
      } else {
        this.getSwal('País agregado', r.data, 'success' ,false);
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
        this.getSwal('Departamento agregado', r.data, 'success' ,false);
      }
      this.getStates(params.country_id);
      this.getSwal('Departamento/Estado agregado', r.data, 'success', false);
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
