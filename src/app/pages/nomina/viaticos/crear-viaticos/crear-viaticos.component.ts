import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { viaticos } from '../viaticos';
import { CrearViaticosService } from './crear-viaticos.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Router } from '@angular/router';
import * as help from './helpers/import';
import * as moment from 'moment';
import { OrdenesProduccionService } from 'src/app/pages/manufactura/services/ordenes-produccion.service';
@Component({
  selector: 'app-crear-viaticos',
  templateUrl: './crear-viaticos.component.html',
  styleUrls: ['./crear-viaticos.component.scss'],
})
export class CrearViaticosComponent implements OnInit {
  @Input('id') id;
  @Input('data') data;
  @Input('title') title = 'Crear viático';
  func: any = {
    id: '',
    identifier: '',
    position: '',
    passport_number: '',
    visa: '',
    type: '',
  };

  origen = viaticos.origen;

  // trayecto:any = ['Seleccione', 'Aeropuerto-Casa', 'Aeropuerto-Embajada', 'Aeropuerto-Maquinados', 'Aeropuerto-Terminal'];
  city: any = [];
  tipo: any = ['Seleccione', 'Nacional', 'Internacional'];
  tipo_transporte: any = ['Ida', 'Vuelta'];
  hotels: any = [];
  hotels_inter: any = [];
  people: any[] = [];
  person_selected: any;
  form: FormGroup;
  value: any;
  public acomodation_for_hotel: any[] = []
  hotels_list: any[] = []
  work_orders: any[] = []

  constructor(
    private roter: Router,
    private _swal: SwalService,
    private fb: FormBuilder,
    private location: Location,
    private _viatico: CrearViaticosService,
    private _work_order: OrdenesProduccionService
  ) { }

  async ngOnInit() {
    this.getWorkOrders()
    this.createForm();
    this.crearListener();
    this.getPeople();
    this.getRouteTaxi();
    this.getCity();
    await this.getHotels();
    this.validateData();
  }

  getWorkOrders() {
    let params = {

    }
    this._work_order.getWorkOrdersIndex(params).subscribe((res: any) => {
      this.work_orders = res.data
    })
  }

  getCity() {
    this._viatico.getCity().subscribe((r: any) => {
      this.city = r.data;
    });
  }
  regresar() {
    this.location.back();
  }

  getPeople() {
    this._viatico.getPeople().subscribe((res: any) => {
      this.people = res.data;
    });
  }

  crearListener() {
    this.form
      .get('travel')
      .get('person_id')
      .valueChanges.subscribe((res) => {
        this.func = this.people.find((r) => r.id == res);
      });

    this.form.get('travel').get('departure_date').valueChanges.subscribe(e => {
      /* const date_end = moment(this.form.get('travel').get('departure_date').value, "YYYY-MM-DD");

      console.log({ date_end, e });

      console.log(moment(e, "YYYY-MM-DD").diff(date_end, 'days')); */


    })
    this.form.get('travel').get('arrival_date').valueChanges.subscribe(e => {
      console.log(e);
    })
  }

  createForm() {
    this.form = help.functions.createForm(this.fb);
    help.functions.listerTotal(this.form);
  }

  validateData() {
    if (this.data) {
      help.functions.fillInForm(this.form, this.data, this.fb);
      this.func = help.functions.fillInPerson(this.data);
      //this.func = help.functions.fillInPerson(this.data);
    }
  }
  getBasicControl(): FormGroup {
    let group = help.hospedajeHelper.createHotelGroup(this.fb);
    help.hospedajeHelper.subscribeHospedaje(
      group,
      this.form,
      this.hospedajeList,
    );
    return group;
  }

  async getHotels() {
    await this._viatico
      .getHotels()
      .toPromise()
      .then((res: any) => {
        this.hotels_list = Array.from(new
          Set([...res.data.nacional, ...res.data.internacional])
        )
        help.hospedajeHelper.consts.national_hotels = res.data.nacional;
        help.hospedajeHelper.consts.international_hotels =
          res.data.internacional;
      });
  }

  newHospedaje() {
    let hospedaje = this.hospedajeList;
    hospedaje.push(this.getBasicControl());
  }

  get hospedajeList() {
    return this.form.get('hospedaje') as FormArray;
  }

  deleteHospedaje(i) {
    this.hospedajeList.removeAt(this.hospedajeList.length - 1);
    help.hospedajeHelper.getTotalHospedaje(this.form, this.hospedajeList);
  }

  changeTipo(res, control: FormControl) {
    control.patchValue({
      hoteles:
        res == 'Nacional'
          ? help.hospedajeHelper.consts.national_hotels
          : help.hospedajeHelper.consts.international_hotels,
    });
  }

  seleccionHotel(e, item) {
    this.hotels_list.forEach(element => {
      if (element.id == e.target.value) {
        this.acomodation_for_hotel = element.accommodations
        //help.hospedajeHelper.consts.acomodationForHotel = element.accommodations
      }
    });
    this.actualizaTipAlojam(item)
  }

  actualizaTipAlojam (item) {
    item.get('accommodation').valueChanges.subscribe(r => {
      let rate = this.acomodation_for_hotel.find(e => e.id == r)
      item.patchValue({
        rate: rate.pivot.price
      })
    })
  }

  /***************** TRANSPORTE TERRESTRE ****************/

  getTransporteControl(): FormGroup {
    let group = help.transporteHelper.createGroup(this.fb);
    help.transporteHelper.createListener(group, this.form, this.transporteList);
    return group;
  }

  get transporteList() {
    return this.form.get('transporte') as FormArray;
  }

  newTransporte() {
    let transporte = this.transporteList;
    transporte.push(this.getTransporteControl());
  }

  deleteTransporte(i) {
    this.transporteList.removeAt(this.transporteList.length - 1);
    help.transporteHelper.getTotal(this.form, this.transporteList);
  }

  getTaxisControl(): FormGroup {
    let group = help.taxiHelper.createGroup(this.fb, this.form, this.taxiList);
    return group;
  }

  get taxiList() {
    return this.form.get('taxi') as FormArray;
  }
  getCities() {
    this._viatico.getCity();
  }

  getRouteTaxi() {
    this._viatico.getRouteTaxi().subscribe((res: any) => {
      help.taxiHelper.consts.taxis = res.data;
    });
  }

  newTaxi() {
    let taxi = this.taxiList;
    taxi.push(this.getTaxisControl());
  }

  deleteTaxi(i) {
    this.taxiList.removeAt(this.taxiList.length - 1);
    this.getTotalTaxi();
  }

  getTotalTaxi() {
    help.taxiHelper.changeTotal(this.form, this.taxiList);
  }

  get FeedingList() {
    return this.form.get('feeding') as FormArray;
  }

  newFeeding() {
    let group = help.alimHelper.createGroup(this.fb, this.form);
    help.alimHelper.createListener(group, this.form, this.FeedingList);
    this.FeedingList.push(group);
  }

  deleteFeeding(i) {
    this.FeedingList.removeAt(this.FeedingList.length - 1);
    help.alimHelper.getTotal(this.form, this.FeedingList);
  }

  sumarTotal() {
    help.functions.sumarTotal(this.form);
  }

  crearViatico() {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: `Vamos a ${this.id ? 'editar' : 'crear'
        } una solicitud de viático`,
    }).then((r) => {
      if (r.isConfirmed) {
        if (this.id) {
          this._viatico.actualizarViatico(this.id, this.form.value).subscribe(
            (res: any) => this.showSucess(),
            (err) => this.showError(err)
          );
        } else {
          this._viatico.crearViatico(this.form.value).subscribe(
            (res: any) => this.showSucess(),
            (err) => this.showError(err)
          );
        }
      }
    });
  }

  showSucess() {
    this._swal.show({
      icon: 'success',
      text: `Viático  ${this.id ? 'editado' : 'creado'
        } con éxito`,
      title: 'Operación exitosa',
      showCancel: false,
      timer: 1000
    });
    this.roter.navigateByUrl('/nomina/viaticos');
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
