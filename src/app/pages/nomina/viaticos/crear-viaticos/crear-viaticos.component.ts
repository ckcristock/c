import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { viaticos } from '../viaticos';
import { CrearViaticosService } from './crear-viaticos.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import {Router} from '@angular/router';
@Component({
  selector: 'app-crear-viaticos',
  templateUrl: './crear-viaticos.component.html',
  styleUrls: ['./crear-viaticos.component.scss'],
})
export class CrearViaticosComponent implements OnInit {
  func: any = {
    id: '',
    identifier: '',
    position: '',
    passport_number: '',
    visa: '',
    type: '',
  };
  hospedaje_nacional: any;
  hospedaje_internacional: any;
  origen = viaticos.origen;
  taxis: any;
  // trayecto:any = ['Seleccione', 'Aeropuerto-Casa', 'Aeropuerto-Embajada', 'Aeropuerto-Maquinados', 'Aeropuerto-Terminal'];
  city: any = [];
  tipo: any = ['Seleccione', 'Nacional', 'Internacional'];
  tipo_transporte: any = ['Ida', 'Vuelta'];
  hotels: any = [];
  hotels_inter: any = [];
  people: any[] = [];
  person_selected: any;
  form: FormGroup;
  constructor(
    private roter: Router,
    private _swal: SwalService,
    private fb: FormBuilder,
    private location: Location,
    private crearViaticoService: CrearViaticosService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.crearListener();
    this.getPeople();
    this.getHotels();
    this.getRouteTaxi();
    this.getCity();
    /* this.hoteles = this.hospedaje_nacional; */
  }

  getCity() {
    this.crearViaticoService.getCity().subscribe((r: any) => {
      this.city = r.data;
    });
  }
  regresar() {
    this.location.back();
  }

  getPeople() {
    this.crearViaticoService.getPeople().subscribe((res: any) => {
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
  }

  createForm() {
    this.form = this.fb.group({
      baggage_usd: [0],
      baggage_cop: [0],
      total_hotels_usd: [0],
      total_hotels_cop: [0],
      total_transports_cop: [0],
      total_taxis_usd: [0],
      total_taxis_cop: [0],
      total_feedings_usd: [0],
      total_feedings_cop: [0],
      total_laundry_cop: [0],
      total_laundry_usd: [0],
      total_usd: [0],
      total_cop: [0],
      other_expenses_cop: [0],
      other_expenses_usd: [0],
      observation: [0],
      travel: this.fb.group({
        person_id: [''],
        origin_id: [''],
        destinity_id: [''],
        travel_type: [''],
        departure_date: [''],
        arrival_date: [''],
        n_nights: [''],
      }),
      hospedaje: this.fb.array([]),
      transporte: this.fb.array([]),
      taxi: this.fb.array([]),
      feeding: this.fb.array([]),
    });
    //this.newHospedaje();
    //this.newTransporte();
    // this.newTaxi();
    //this.newFeeding();
    this.subscribesTotal();
  }

  /***************** HOSPEDAJE ****************/
  getBasicControl(): FormGroup {
    let group = this.fb.group({
      tipo: ['Seleccione'],
      hotel_id: [],
      phone: [],
      rate: [],
      hoteles: [],
      address: [],
      n_night: [0],
      total: [0],
      breakfast: [],
      who_cancels: [],
      accommodation: ['Sencilla'],
    });
    group.get('hotel_id').valueChanges.subscribe((value) => {
      let hotel = group.get('hoteles').value.find((res) => res.id == value);
      group.patchValue({
        address: hotel.address,
        phone: hotel.phone,
        rate: hotel.simple_rate,
        breakfast: hotel.breakfast,
      });
    });
    group.get('accommodation').valueChanges.subscribe((value) => {
      let hotel = group
        .get('hoteles')
        .value.find((res) => res.accommodation == value);
      group.patchValue({
        rate: value == 'Sencilla' ? hotel.simple_rate : hotel.double_rate,
      });
    });
    group.get('rate').valueChanges.subscribe((value) => {
      this.subtotalHotel(group, value, group.value.n_night);
    });
    group.get('n_night').valueChanges.subscribe((value) => {
      this.subtotalHotel(group, value, group.value.rate);
    });
    return group;
  }

  subtotalHotel(group, val1, val2) {
    group.patchValue({ total: val1 * val2 });
    this.getTotalHospedaje();
  }

  getHotels() {
    this.crearViaticoService.getHotels().subscribe((res: any) => {
      this.hospedaje_nacional = res.data.nacional;
      this.hospedaje_internacional = res.data.internacional;
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
    this.getTotalHospedaje();
  }

  getTotalHospedaje() {
    let total = this.hospedajeList.value.reduce(
      (a, b) => {
        if (b.tipo == 'Nacional')
          return { inter: a.inter, nac: a.nac + b.total };
        return { nac: a.nac, inter: a.inter + b.total };
      },
      { nac: 0, inter: 0 }
    );

    this.form.patchValue({
      total_hotels_cop: total.nac,
      total_hotels_usd: total.inter,
    });
  }

  changeTipo(res, control: FormControl) {
    control.patchValue({
      hoteles:
        res == 'Nacional'
          ? this.hospedaje_nacional
          : this.hospedaje_internacional,
    });
  }

  /***************** TRANSPORTE TERRESTRE ****************/

  getTransporteControl(): FormGroup {
    let group = this.fb.group({
      type: ['Ida'],
      journey: [],
      company: [],
      ticket_payment: [],
      departure_date: [],
      ticket_value: [0],
    });
    group.get('ticket_value').valueChanges.subscribe((value) => {
      this.getTotalTransporte();
    });
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
    this.getTotalTransporte();
  }

  getTotalTransporte() {
    setTimeout(() => {
      let total = this.transporteList.controls.reduce((a, b) => {
        return a + b.value.ticket_value;
      }, 0);
      this.form.patchValue({
        total_transports_cop: total,
      });
    }, 50);
  }

  /***************** TAXIS ****************/

  getTaxisControl(): FormGroup {
    let group = this.fb.group({
      journey: [this.taxis],
      journey_id: [this.taxis],
      taxi_city_id: ['Seleccione'],
      city_selected: [],
      taxi_cities: [],
      rate: [0],
      journeys: [0],
      total: [0],
    });

    group.get('journey_id').valueChanges.subscribe((value) => {
      let taxi_cities = this.taxis.find((r) => r.id == value).taxi_cities;

      group.patchValue({
        taxi_cities,
        taxi_city_id: taxi_cities[0].id,
      });
    });
    group.get('taxi_city_id').valueChanges.subscribe((value) => {
      console.log(value);
      let city_selected = group
        .get('taxi_cities')
        .value.find((r) => r.id == value);
      console.log(city_selected);

      group.patchValue({
        city_selected,
        rate: city_selected.value,
      });
    });
    group.get('rate').valueChanges.subscribe((value) => {
      let taxi = group.value;
      let totalTaxi = value * taxi.journeys;
      group.patchValue({
        total: totalTaxi,
      });
      this.getTotalTaxi();
    });
    group.get('journeys').valueChanges.subscribe((value) => {
      let taxi = group.value;
      let totalTaxi = value * taxi.rate;
      group.patchValue({
        total: totalTaxi,
      });
      this.getTotalTaxi();
    });
    return group;
  }

  get taxiList() {
    return this.form.get('taxi') as FormArray;
  }

  /*  getTaxis() {
    this.crearViaticoService.getTaxis()
    .subscribe( (res:any) =>{
      this.taxis = res.data;
    })
  } */

  getCities() {
    this.crearViaticoService.getCity();
  }

  getRouteTaxi() {
    this.crearViaticoService.getRouteTaxi().subscribe((res: any) => {
      this.taxis = res.data;
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
    console.log('herer');
    let total = this.taxiList.value.reduce(
      (a, b) => {
        console.log(b);
        if (b.city_selected.type == 'Nacional') {
          return { inter: a.inter, nac: a.nac + b.total };
        }
        return { nac: a.nac, inter: a.inter + b.total };
      },
      { nac: 0, inter: 0 }
    );

    this.form.patchValue({
      total_taxis_usd: total.inter,
      total_taxis_cop: total.nac,
    });
  }

  /***************** FEEDING ****************/

  getFeedindControl(): FormGroup {
    let group = this.fb.group({
      type: ['Seleccione'],
      personType: [],
      breakfast: [],
      stay: [0],
      rate: [0],
      total: [0],
    });
    group.get('rate').valueChanges.subscribe((value) => {
      let feeding = group.value;
      let totalFeeding = value * feeding.stay;
      group.patchValue({
        total: totalFeeding,
      });
    });
    group.get('stay').valueChanges.subscribe((value) => {
      let feeding = group.value;
      let totalFeeding = value * feeding.rate;
      group.patchValue({
        total: totalFeeding,
      });
      this.getTotalFeeding();
    });
    return group;
  }

  get FeedingList() {
    return this.form.get('feeding') as FormArray;
  }

  newFeeding() {
    let feeding = this.FeedingList;
    feeding.push(this.getFeedindControl());
  }

  deleteFeeding(i) {
    this.FeedingList.removeAt(this.FeedingList.length - 1);
    this.getTotalFeeding();
  }

  getTotalFeeding() {
    let total = this.FeedingList.value.reduce(
      (a, b) => {
        if (b.type == 'Nacional') {
          return { inter: a.inter, nac: a.nac + b.total };
        }
        return { nac: a.nac, inter: a.inter + b.total };
      },
      { nac: 0, inter: 0 }
    );

    this.form.patchValue({
      total_feedings_cop: total.nac,
      total_feedings_usd: total.inter,
    });
  }

  subscribesTotal() {
    this.form.get('total_hotels_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_transports_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_feedings_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_taxis_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_hotels_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });

    this.form.get('total_feedings_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_taxis_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_laundry_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('total_laundry_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('baggage_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('baggage_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('other_expenses_cop').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
    this.form.get('other_expenses_usd').valueChanges.subscribe((r) => {
      this.sumarTotal();
    });
  }

  sumarTotal() {
    setTimeout(() => {
      let forma = this.form.value;
      let total_cop =
        parseFloat(forma.total_hotels_cop) +
        parseFloat(forma.total_transports_cop) +
        parseFloat(forma.total_feedings_cop) +
        parseFloat(forma.total_taxis_cop) +
        parseFloat(forma.baggage_cop) +
        parseFloat(forma.total_laundry_cop) +
        parseFloat(forma.other_expenses_cop);
      let total_usd =
        parseFloat(forma.total_hotels_usd) +
        parseFloat(forma.total_feedings_usd) +
        parseFloat(forma.total_laundry_usd) +
        parseFloat(forma.baggage_usd) +
        parseFloat(forma.total_taxis_usd) +
        parseFloat(forma.other_expenses_usd);
      this.form.patchValue({
        total_cop,
        total_usd,
      });
    }, 300);
  }

  crearViatico() {
    this._swal
      .show({
        text: 'Se dispone a crear una solicitud de viático',
        title: '¿Está seguro?',
        icon: 'warning',
      })
      .then((r) => {
        if (r.isConfirmed) {
          this.crearViaticoService.crearViatico(this.form.value).subscribe(
            (res: any) => {
              this._swal.show({
                icon: 'success',
                text: 'Viático creado con éxito',
                title: 'Operación exitosa',
                showCancel: false,
              });
	      this.roter.navigateByUrl('/nomina/viaticos');
            },
            (err) => {
              this._swal.show({
                icon: 'error',
                title: '¡Ooops!',
                showCancel: false,
                text: err.code,
              });
            }
          );
        }
      });
  }
}
