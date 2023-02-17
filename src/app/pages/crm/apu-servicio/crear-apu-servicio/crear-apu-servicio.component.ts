import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ApuServicioService } from '../apu-servicio.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import * as help from './helpers/imports';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
import { UserService } from 'src/app/core/services/user.service';
import { consts } from 'src/app/core/utils/consts';
import { CalculationBasesService } from 'src/app/pages/ajustes/configuracion/base-calculos/calculation-bases.service';


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
  calculationBase: any = {}
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
  user_id;
  masksMoney = consts
  constructor(
    private _apuService: ApuServicioService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private router: Router,
    private _calculationBase: CalculationBasesService,
    public _consecutivos: ConsecutivosService,
    private _user: UserService
  ) {
    this.user_id = _user.user.person.id
  }

  async ngOnInit() {
    this.datosCabecera.Fecha = this.id ? this.data?.created_at : new Date();
    this.datosCabecera.Titulo = this.title;
    this.loading = true;
    await this.getBases()
    this.createForm();
    this.getProfiles();
    this.getClients();
    this.getPeople();
    this.getTravelExpenseEstimation();
    await this.getCities();
    this.validateData();
    this.getConsecutivo();
    this.loading = false;
  }

  async getBases() {
    await this._calculationBase.getAll().toPromise().then((r: any) => {
      this.calculationBase = r.data.reduce((acc, el) => ({ ...acc, [el.concept]: el }), {})
      console.log(this.calculationBase)
      /* if (this.dataEdit) {
        this.calculationBase.trm.value = this.dataEdit.trm
      } */
    })
  }


  createForm() {
    this.form = help.functionsApuService.createForm(this.fb, this.clients, this.user_id, this.calculationBase);
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

  async getCities() {
    await this._apuService.getCities().toPromise().then((r: any) => {
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
    if (this.form.invalid) {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Revisa la información y vuelve a intentarlo',
        showCancel: false
      })
      this.form.markAllAsTouched()
    } else {
    this._swal
      .show({
        text: `Vamos a ${this.id && this.title == 'Editar servicio' ? 'editar' : 'crear'} un servicio`,
        title: '¿Estás seguro(a)?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          if (this.id && this.title == 'Editar servicio') {
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
  }

  showSuccess() {
    this._swal.show({
      icon: 'success',
      text: `Servicio ${this.id && this.title == 'Editar servicio' ? 'editado' : 'creado'} con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
      timer: 1000
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
  getConsecutivo() {
    this._consecutivos.getConsecutivo('apu_services').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      if (this.title !== 'Editar servicio') {
        this.buildConsecutivo(this.form.get('city_id').value, r)
        this.form.get('city_id').valueChanges.subscribe(value => {
          this.buildConsecutivo(value, r)
        });
      } else {
        this.datosCabecera.Codigo = this.data.code
        this.form.patchValue({
          code: this.data.code
        })
        this.form.get('city_id').disable()
      }
    })
  }

  buildConsecutivo(value, r, context = '') {
    let city = this.cities.find(x => x.value === value)
    let con = this._consecutivos.construirConsecutivo(r.data, city?.abbreviation, context);
    this.datosCabecera.Codigo = con
    this.form.patchValue({
      code: con
    })
  }

}
