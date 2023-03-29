import { Component, OnInit, ViewChild } from '@angular/core';
import { PaisesService } from "../paises-ciudades/paises/paises.service";
import { DepartamentosService } from "../departamentos-municipios/departamentos/departamentos.service";
import { CiudadesService } from "../paises-ciudades/ciudades/ciudades.service";
import { SwalService } from "../../../../pages/ajustes/informacion-base/services/swal.service";
import { MunicipiosService } from '../departamentos-municipios/municipios/municipios.service';
import { MatTableDataSource } from '@angular/material';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {
  @ViewChild('modal') modal: any
  countries: any[] = [];
  states: any[] = [];
  form: FormGroup;
  municipalities: any[] = [];
  filtro_pais: any = {
    name: ''
  }
  filtro_depto: any = {
    name: ''
  }
  filtro_muni: any = {
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

  loadingCountry: boolean = true;
  loadingState: boolean = true;
  loadingMunicipality: boolean = true;
  tipo = ''
  operation = ''
  municipalitySelected: any = 0;
  dataSource = new MatTableDataSource();

  constructor(
    private _countries: PaisesService,
    private _state: DepartamentosService,
    private _municipality: MunicipiosService,
    private _modal: ModalService,
    private _swal: SwalService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCountries();
  }

  stop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  openConfirm(confirm) {
    this._modal.open(confirm, 'md')
  }

  createModal(tipo) {
    this.form = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      dian_code: ['', Validators.required],
      dane_code: ['', tipo != 'paises' ? Validators.required : Validators.nullValidator],
      percentage_product: ['', tipo == 'municipios' ? Validators.required : Validators.nullValidator],
      percentage_service: ['', tipo == 'municipios' ? Validators.required : Validators.nullValidator],
      abbreviation: ['', tipo == 'municipios' ? Validators.required : Validators.nullValidator],
      country_id: [''],
      department_id: ['']
    })
  }

  openModal(tipo, add) {
    this.createModal(tipo)
    this.operation = 'guardar';
    this.tipo = tipo;
    this.openConfirm(add)
  }

  editar(tipo, modelo, add) {
    this.createModal(tipo)
    this.form.patchValue({
      id: modelo.id,
      name: modelo.name,
      dian_code: modelo.dian_code,
      dane_code: modelo.dane_code,
      percentage_product: modelo.percentage_product,
      percentage_service: modelo.percentage_service,
      abbreviation: modelo.abbreviation,
      country_id: modelo.country_id,
      department_id: modelo.department_id
    })
    this.tipo = tipo
    this.operation = 'editar';
    this.openConfirm(add)
  }

  getCountries(page = 1) {
    this.pagination_pais.page = page;
    let params = {
      ...this.pagination_pais, ...this.filtro_pais
    }
    this.loadingCountry = true;
    this._countries.getCountries(params).subscribe((r: any) => {
      this.countries = r.data.data;
      this.pagination_pais.collectionSize = r.data.total;
      if (this.countries.length > 0) {
        this.countries[0].selected = true;
        this.getStates(this.countries[0].id);
      }
      this.loadingCountry = false;
    });
  }

  getStates(country_id, page = 1) {
    this.pagination_depto.page = page;
    let params = {
      ...this.pagination_depto, ...this.filtro_depto
    }
    this.loadingState = true
    this._state.getDepartmentById(country_id, params)
      .subscribe((r: any) => {
        this.states = r.data.data;
        this.pagination_depto.collectionSize = r.data.total;
        if (this.states.length > 0) {
          this.states[0].selected = true;
          this.getMunicipalities(this.states[0].id);
        }
        if (r.data.total == 0) {
          this.municipalities = [];
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
    this._municipality.getAllMunicipalitiesByDepartment(state_id, params)
      .subscribe((r: any) => {
        this.municipalities = r.data.data;
        this.pagination_muni.collectionSize = r.data.total;
        if (this.municipalities.length != 0) {
          this.municipalities[0].selected = true;
        }
        if (r.data.total == 0) {
          this.municipalities = [];
        }
      })
    this.loadingMunicipality = false;
  }

  selected(model, value) {
    model = model.map(m => {
      m.selected = m.id == value ? true : false;
    })
  }

  getSwal(title, text, icon, showCancel) {
    this._swal.show({
      title,
      text,
      icon,
      showCancel
    }, false)
  }

  save() {
    if (this.form.valid) {
      if (this.tipo == 'municipios') {
        this.saveMunicipality(this.form.value)
      }
      if (this.tipo == 'departamentos') {
        this.saveState(this.form.value)
      }
      if (this.tipo == 'paises') {
        this.saveCountry(this.form.value);
      }
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Completa los campos.',
        showCancel: false
      })
    }
  }

  saveCountry(params) {
    this._countries.createCountry(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error en País', r.err, 'error', false);
      } else {
        this.getSwal('País', r.data, 'success', false);
      }
      this.getCountries()
      this._modal.close();
    })
  }

  saveState(params) {
    this._state.setDepartment(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error en Departamento', r.err, 'error', false);
      } else {
        this.getSwal('Departamento', r.data, 'success', false);
      }
      this.getStates(params.country_id);
      this.getSwal('Departamento/Estado', r.data, 'success', false);
      this._modal.close();
    })
  }

  saveMunicipality(params: any) {
    this._municipality.createNewMunicipality(params).subscribe((r: any) => {
      if (r.status == false) {
        this.getSwal('Error en Municipio', r.err, 'error', false);
      } else {
        this.getSwal('Municipio agregado', r.data, 'success', false);
      }
      this.getMunicipalities(params.department_id);
      this.getSwal('Municipio agregado', r.data, 'success', false);
      this._modal.close();
    })
  }
}
