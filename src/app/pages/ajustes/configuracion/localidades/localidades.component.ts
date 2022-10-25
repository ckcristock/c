import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaisesService } from "../paises-ciudades/paises/paises.service";
import { DepartamentosService  } from "../departamentos-municipios/departamentos/departamentos.service";
import { CiudadesService } from "../paises-ciudades/ciudades/ciudades.service";
import { SwalService } from "../../../../pages/ajustes/informacion-base/services/swal.service";
import { showConfirm } from 'src/app/core/utils/confirmMessage';

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
  cities: any[];
  loading: boolean = true;
  name = ''
  tipo = ''
  id = ''
  operation = ''
  countrySelected:any = 1;
  stateSelected:any = 0;

  constructor(
    private _countries: PaisesService,
    private _state: DepartamentosService,
    private _cities: CiudadesService,
    private modalService: NgbModal,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    //luego buscar las relaciones
    this._countries.getCountries().subscribe((r:any) => {
      this.countries = r.data.data;
      //this.loading = false
      if (this.countries) {
        this.getStates(this.countries[1].id);
        this.countries[1].selected = true;
      }
    });
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

  getStates(country_id){
    //hace la consulta de acuerdo al país seleccionado
    this.countrySelected = country_id
    this._state.getDepartmentById(this.countrySelected)
      .subscribe((r:any)=>{
      if (r.status == true) {
        this.states = r.data;
        if (this.states != null) {
          this.getCities(this.states[0].id);
          this.states[0].selected = true;
        }
      }
      if (r.status == false) {
        this.states = null;
        this.cities = null;
      }
    })
  }

  getCities(state_id){
  //hace la consulta de acuerdo al estado/departamento seleccionado
    this.stateSelected = state_id
    this._cities.getCitiesByStateId(this.stateSelected)
      .subscribe((r:any)=>{
      if(r.status==true){
        this.cities = r.data
        if(this.cities){
          this.cities[0].selected = true;
          this.loading = false
        }
      } else {
        this.cities = null;
      }
    })
  }

  selected(model, value){
    model = model.map(m=>{
      m.selected = m.id == value ? true : false;
    })
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
    if(tipo == 'ciudades'){
      this._cities.delete(id).subscribe(r =>{
        this.getCountries()
        this.deleteSwal.show();
      })
    }
  }

  save() {
    if (this.tipo == 'paises') {
      let selected = this.countries.find(r => r.selected == true);
      console.warn(selected.value)
      let params: any = { group_id: selected.value, name: this.name }
      params ? params.id = this.id : ''
      params ? params.id = this.id : ''

      this.saveCity(params)
    }
    if (this.tipo == 'departamentos') {
      let selected = this.states.find(r => r.selected == true);
      console.warn(selected.value)
      let params: any = { dependency_id: selected.value, name: this.name }
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
    this._countries.createCountry(params).subscribe(r => {
      this.getCountries()
      this.modalService.dismissAll();
    })
  }
  saveState(params) {
    this._state.createNewDepartment(params).subscribe(r => {
      this.getStates(params.state_id)
      this.modalService.dismissAll();
    })
  }
  saveCity(params) {
    this._cities.createCity(params).subscribe(r => {
      this.getCities(params.city_id)
      this.modalService.dismissAll();
    })
  }



}
