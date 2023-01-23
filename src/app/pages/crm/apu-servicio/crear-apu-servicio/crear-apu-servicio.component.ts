import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApuServicioService } from '../apu-servicio.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import * as help from './helpers/imports';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';


@Component({
  selector: 'app-crear-apu-servicio',
  templateUrl: './crear-apu-servicio.component.html',
  styleUrls: ['./crear-apu-servicio.component.scss']
})
export class CrearApuServicioComponent implements OnInit {
  @Input('id') id;
  @Input('data') data: any;
  @Input('title') title = 'Crear servicio';
  form: FormGroup;
  date: Date = new Date();
  loading: boolean = false;
  people: any[] = [];
  cities: any[] = [];
  clients: any[] = [];
  collapsed: boolean[] = [];
  mpMcollapsed: boolean[] = [];
  profiles: any[] = [];
  tEestimations: any = [];
  desplazamientos = [
    { text: 'Aero', value: 1 },
    { text: 'Terrestre', value: 2 },
    { text: 'N/A', value: 3 }
  ]
  jornadas = [
    { text: 'Diurna', value: 'Diurna' },
    { text: 'Nocturna', value: 'Nocturna' }
  ]
  datosCabecera = {
    Titulo: '',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }

  constructor(
    private _apuService: ApuServicioService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private router: Router,
    public _consecutivos: ConsecutivosService,
  ) { }

  async ngOnInit() {
    this.datosCabecera.Fecha = this.id ? this.data?.created_at : new Date();
    this.datosCabecera.Titulo = this.title;
    this.loading = true;
    this.createForm();
    this.getProfiles();
    this.getClients();
    this.getPeople();
    await this.getCities();
    this.getTravelExpenseEstimation();
    this.validateData();
    this.loading = false;
    this.getConsecutivo();
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('apu_services').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      this.construirConsecutivo(r);
    })
  }

  construirConsecutivo(r) {
    if (!this.id) {
      let con = this._consecutivos.construirConsecutivo(r.data);
      this.datosCabecera.Codigo = con
      this.form.patchValue({
        code: con
      })
    } else {
      this.datosCabecera.Codigo = this.data?.code
      this.form.patchValue({
        code: this.data?.code
      })
    }
    if (r.data.city) {
      this.form.get('city_id').valueChanges.subscribe(value => {
        let city = this.cities.find(x => x.value === value)
        let con = this._consecutivos.construirConsecutivo(r.data, city.abbreviation);
        this.datosCabecera.Codigo = con
        this.form.patchValue({
          code: con
        })
      });
    }
  }

  createForm() {
    this.form = help.functionsApuService.createForm(this.fb, this.clients);
  }

  validateData() {
    if (this.data) {
      setTimeout(() => {
        help.functionsApuService.fillInForm(this.form, this.data, this.fb, this.profiles, this.cities);
      }, 1200);
    }
  }

  getPeople() {
    this._apuService.getPeopleXSelect().subscribe((r: any) => {
      this.people = r.data;
    })
  }

  getProfiles() {
    this._apuService.getProfiles().subscribe((r: any) => {
      this.profiles = r.data;
    })
  }

  getCities() {
    this._apuService.getCities().subscribe((r: any) => {
      this.cities = r.data;
      help.functionsApuService.cityRetention(this.form, this.cities);
    })
  }

  getClients() {
    this._apuService.getClient().subscribe((r: any) => {
      this.clients = r.data;
    })
  }

  getTravelExpenseEstimation() {
    this._apuService.getTravelExpenseEstimation().subscribe((r: any) => {
      this.tEestimations = r.data;
    })
  }

  cmoControl(): FormGroup { // cmo = Calculo Mano Obra
    let group = help.cmoHelper.createcmoGroup(
      this.form,
      this.fb,
      this.profiles,
      this.tEestimations,
      this.cities);
    return group;
  }

  get cmoList() {
    return this.form.get('calculate_labor') as FormArray
  }

  newCmoList() {
    this.cmoList.push(this.cmoControl());
  }

  deleteCmoList(i) {
    this.cmoList.removeAt(i);
  }

  mpMCalculateLaborControl(): FormGroup { // cmo = Calculo Mano Obra
    let group = help.mpmCalculateLaborHelper.createMpmCalculateLaborGroup(this.form, this.fb, this.profiles, this.tEestimations,
      this.cities);
    return group;
  }

  get mpMCalculateLaborList() {
    return this.form.get('mpm_calculate_labor') as FormArray
  }

  newmpMCalculateLaborList() {
    this.mpMCalculateLaborList.push(this.mpMCalculateLaborControl());
  }

  deletempMCalculateLaborList(i) {
    this.mpMCalculateLaborList.removeAt(i);
  }

  save() {
    this._swal
      .show({
        text: `Se dispone a ${this.id ? 'editar' : 'crear'} un apu servicio`,
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id) {
            this._apuService.update(this.form.value, this.id).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          } else {
            this._apuService.save(this.form.value).subscribe(
              (res: any) => this.showSuccess(),
              (err) => this.showError(err)
            );
          }
        }
      });
  }

  showSuccess() {
    this._swal.show({
      icon: 'success',
      text: `Apu Servicio ${this.id ? 'editado' : 'creado'} con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
    });
    this.router.navigateByUrl('/crm/apus');
  }
  showError(err) {
    this._swal.show({
      icon: 'error',
      title: '¡Ooops!',
      showCancel: false,
      text: err.code,
    });
  }

}
