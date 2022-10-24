import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaisesService } from "../paises-ciudades/paises/paises.service";
import { DepartamentosService  } from "../departamentos-municipios/departamentos/departamentos.service";
import { CiudadesService } from "../paises-ciudades/ciudades/ciudades.service";
import { ThisReceiver } from '@angular/compiler';

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
  loading: boolean = false;
  name = ''
  tipo = ''
  id = ''
  operation = ''
  countrySelected:any;
  stateSelected:any;

  constructor(
    private _countries: PaisesService,
    private _state: DepartamentosService,
    private _cities: CiudadesService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    this._countries.getCountries().subscribe((r:any) => {
      this.countries = r.data.data;
      if (this.countries) {
        this.getStates(this.countries[1].value);
        this.countries[1].selected = true;

      }
      //luego buscar las relaciones
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
    this.countrySelected = country_id
    this._state.getDepartmentPaginate().subscribe((r:any)=>{
      this.states = r.data.data
      if (this.states) {
        this.getCities(this.states[0].value);
        this.states[0].selected = true;
      }
    })
//hacer la consulta de acuerdo al país seleccionado
  }

  getCities(state_id){
//hacer la consulta de acuerdo al estado seleccionado
    this.stateSelected = state_id
    this._cities.getCities().subscribe((r:any)=>{
      console.log(r.data)
      this.cities = r.data.data
    })
  }

  selected(model, value){
    model = model.map(m=>{
      m.selected = m.value == value ? true : false;
    })
  }


}
