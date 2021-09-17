import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { consts } from '../../../core/utils/consts';

@Component({
  selector: 'app-viaticos',
  templateUrl: './viaticos.component.html',
  styleUrls: ['./viaticos.component.scss']
})
export class ViaticosComponent implements OnInit {
  data:any = {
    funcionario: [
      {
        id: 1,
        name: 'Pedro',
        cc: '026262',
        position: 'Developer',
        passport: '103225441',
        visa: 'Si',
        type: 'Empleado'
      },
      {
        id: 2,
        name: 'Pepe',
        cc: '454545',
        position: 'FullStack',
        passport: '103225441',
        visa: 'No',
        type: 'Contratista'
      }
    ],
    origen: [
      {
        name: 'BGA',
        destino: 'MAR',
        tipo_viaje: 'Ida y Vuelta',
        fecha_salida: '11/03/2021',
        fecha_llegada: '14/03/2021',
        n_dias: '3'
      },
      {
        name: 'BOG',
        destino: 'MED',
        tipo_viaje: 'Solo Ida',
        fecha_salida: '11/03/2021',
        fecha_llegada: '14/03/2021',
        n_dias: '5'
      }
    ],
    hospedaje_nacional: [
      {
        id: '',
        name: 'Seleccione',
        direction: '',
        phone: '',
        accommodation_type : '',
        rate: '',
        n_night: '',
        desayuno: '',
        quien_cancela: ''
      },

      {
        id: 1,
        name: 'HOTEL RUTA DEL MAR',
        direction: 'Av troncal de occidente #25-94 Mosquera',
        phone: '350241779',
        accommodation_type : 'Doble',
        rate: '83.000',
        n_night: '4',
        desayuno: 'Si',
        quien_cancela: 'Agencia'
      },
      {
        id: 2,
        name: 'HOTEL SWEET',
        direction: 'Carrera 9 No 20-06 FUND CUND',
        phone: '454545',
        accommodation_type : 'Doble',
        rate: '50',
        n_night: '2',
        desayuno: 'No',
        quien_cancela: 'Agencia'
      }
    ],
    hospedaje_internacional: [
      {
        id: '',
        name: 'Seleccione',
        direction: '',
        phone: '',
        accommodation_type : '',
        rate: '',
        n_night: '',
        desayuno: '',
        quien_cancela: ''
      },
      {
        id: 1,
        name: 'HOTEL CENTRAL PARK',
        direction: 'Av Miguel A. Brostella, Panamá',
        phone: '+5073051234',
        accommodation_type : 'Sencilla',
        rate: '66',
        n_night: '3',
        desayuno: 'No',
        quien_cancela: 'Viajero'
      }
    ],
    transporte_ida: [
      {
        id:1,
        journey: '',
        transport_company: '',
        ticket_payment: '',
        expected_departure_time: '',
        ticket_value: ''
      }
    ],
    transporte_regreso: [
      {
        id:2,
        journey: '',
        transport_company: '',
        ticket_payment: '',
        expected_departure_time: '',
        ticket_value: ''
      }
    ],
    /* taxi_nacional: [
      {
        id:1,
        journey: '',
        city: '',
        rate: '',
        journeys: ''
      }
    ],
    taxi_internacional: [
      {
        id:2,
        journey: '',
        city: '',
        rate: '',
        journeys: ''
      }
    ] */

  }

  func:any = {
    id: '',
    cc: '',
    position: '',
    passport: '',
    visa: '',
    type: ''
  }
  trayecto:any = ['Seleccione', 'Aeropuerto-Casa', 'Aeropuerto-Embajada', 'Aeropuerto-Maquinados', 'Aeropuerto-Terminal'];
  city:any = ['Seleccione', 'BQA', 'BOG', 'MED', 'MAR', 'Otra ciudad'];
  tipo:any = ['Seleccione', 'Nacional','Internacional'];
  tipo_transporte:any = ['Ida', 'Vuelta'];
  hoteles:any = [];
  form: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.crearListener();
    this.hoteles = this.data.hospedaje_nacional;
  }
  
  crearListener() {
    this.form.get('travel').get('person_id').valueChanges.subscribe( res => {
      this.func = this.data.funcionario.find(r => r.id == res)
    })
  }

  createForm() {
    this.form = this.fb.group({
      totalHospedajeDolares: [0],
      totalTransporteDolares: [0],
      totalFeedingDolares: [0],
      totalTaxiDolares: [0],
      totalHospedajePesos: [0],
      totalTransportePesos: [0],
      totalFeedingPesos: [0],
      totalTaxiPesos: [0],
      lavanderiaPesos: [0],
      totalDolares: [0],
      totalPesos: [0],
      travel: this.fb.group({
        person_id: ['']
      }),
      hospedaje: this.fb.array([]),
      transporte: this.fb.array([]),
      taxi: this.fb.array([]),
      feeding: this.fb.array([])
    });
    this.newHospedaje();
    this.newTransporte();
    this.newTaxi();
    this.newFeeding();
    this.subscribesTotal();
  }

  /***************** HOSPEDAJE ****************/  


  
  getBasicControl(): FormGroup {
    let group = this.fb.group({
      tipo: ['Nacional'],
      hotel_id: [],
      phone: [],
      rate: [],
      hoteles: [this.data.hospedaje_nacional],
      direction: [],
      n_night: [0],
      total:  [0]
    });
    group.get('hotel_id').valueChanges.subscribe( value => {
      let hotel = group.get('hoteles').value.find(res => res.id == value);
      group.patchValue({
        direction: hotel.direction,
        phone: hotel.phone,
        rate: hotel.rate,
      })
    })
    group.get('rate').valueChanges.subscribe( value => {
      let hotel =  group.value;
      let totalHospedaje = value * hotel.n_night;
      group.patchValue({
        total: totalHospedaje
      })
    })
    group.get('n_night').valueChanges.subscribe( value => {
      let hotel =  group.value;
      let totalHospedaje = value * hotel.rate;
      group.patchValue({
        total: totalHospedaje
      })
      this.getTotalHospedaje();
    })
    return group;
  }
  
  newHospedaje() {
    let hospedaje = this.hospedajeList
    hospedaje.push(this.getBasicControl())
  }

  get hospedajeList() {
    return this.form.get('hospedaje') as FormArray;
  }
  
  deleteHospedaje(i) {
    this.hospedajeList.removeAt(i);
    this.getTotalHospedaje();
  }

  getTotalHospedaje(){
    let total = this.hospedajeList.value.reduce((a, b) =>{ 
      if ( b.tipo == 'Nacional' )  return  { inter: a.inter ,  nac: a.nac + b.total }
      return  { nac: a.nac ,  inter: a.inter + b.total}
    }, { nac:0,inter:0 } )

    this.form.patchValue({
      totalHospedajePesos: total.nac,
      totalHospedajeDolares: total.inter
    })
  }

  changeTipo(res, control:FormControl ) {
    control.patchValue({
      hoteles:  res == 'Nacional' ? this.data.hospedaje_nacional : this.data.hospedaje_internacional
    })
  }

  /***************** TRANSPORTE TERRESTRE ****************/  

  getTransporteControl(): FormGroup{
    let group = this.fb.group({
      tipo: ['Ida'],
      journey: [],
      transport_company: [],
      ticket_payment: [],
      expected_departure_time: [],
      ticket_value: [0]
    })
    group.get('ticket_value').valueChanges.subscribe( value => {   
  
      this.getTotalTransporte();
    })
    return group;
  }

  get transporteList() {
    return this.form.get('transporte') as FormArray;
  }

  newTransporte() {
    let transporte = this.transporteList
    transporte.push(this.getTransporteControl())
  }

  deleteTransporte(i) {
    this.transporteList.removeAt(i)
    this.getTotalTransporte();
  }

  getTotalTransporte() {
   setTimeout(() => {
      let total = this.transporteList.controls.reduce( (a, b) => {  
      return  a + b.value.ticket_value
      },0)
      this.form.patchValue({
        totalTransportePesos: total,
      })
    }, 50);
  }

  /***************** TAXIS ****************/ 

  getTaxisControl(): FormGroup {
    let group = this.fb.group({
      tipo: ['Nacional'],
      journey: ['Seleccione'],
      city: ['Seleccione'],
      rate: [0],
      journeys: [0],
      total: [0]
    })
    group.get('rate').valueChanges.subscribe( value => {
      let taxi =  group.value;
      let totalTaxi = value * taxi.journeys; 
      group.patchValue({
        total: totalTaxi
      })
    })
    group.get('journeys').valueChanges.subscribe( value => {
      let taxi =  group.value;
      let totalTaxi = value * taxi.rate;
      group.patchValue({
        total: totalTaxi
      })
      this.getTotalTaxi();
    })
    return group;
  }

  get taxiList() {
    return this.form.get('taxi') as FormArray;
  }

  newTaxi() {
    let taxi = this.taxiList;
    taxi.push(this.getTaxisControl());
  }

  deleteTaxi(i) {
    this.taxiList.removeAt(i);
    this.getTotalTaxi();
  }

  getTotalTaxi() {
    let total = this.taxiList.value.reduce((a, b) =>{ 
      if ( b.tipo == 'Nacional' )  return  { inter: a.inter ,  nac: a.nac + b.total }
      return  { nac: a.nac ,  inter: a.inter + b.total}
    }, { nac:0,inter:0 } )
  
    this.form.patchValue({
      totalTaxiDolares: total.inter,
      totalTaxiPesos: total.nac
    })
  }

  /***************** TAXIS ****************/ 
  
  getFeedindControl(): FormGroup {
    let group = this.fb.group({
      tipo: ['Seleccione'],
      type: [],
      breckfast: [],
      stay: [0],
      rate: [0],
      total: [0]
    })
    group.get('rate').valueChanges.subscribe( value => {
      let feeding =  group.value;
      let totalFeeding = value * feeding.stay;
      group.patchValue({
        total: totalFeeding
      })
    })
    group.get('stay').valueChanges.subscribe( value => {
      let feeding =  group.value;
      let totalFeeding = value * feeding.rate;
      group.patchValue({
        total: totalFeeding
      })
      this.getTotalFeeding();
    })
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
    this.FeedingList.removeAt(i);
    this.getTotalFeeding();
  }
  
  getTotalFeeding() {
    let total = this.FeedingList.value.reduce((a, b) =>{ 
      if ( b.tipo == 'Nacional' )  return  { inter: a.inter ,  nac: a.nac + b.total }
      return  { nac: a.nac ,  inter: a.inter + b.total}
    }, { nac:0,inter:0 } )

    this.form.patchValue({
      totalFeedingPesos: total.nac,
      totalFeedingDolares: total.inter
    })
  }

  subscribesTotal() {
    this.form.get('totalHospedajePesos').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalTransportePesos').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalFeedingPesos').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalTaxiPesos').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalHospedajeDolares').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalTransporteDolares').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalFeedingDolares').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
    this.form.get('totalTaxiDolares').valueChanges.subscribe( r => {
      this.sumarTotal();
    })
  }

  sumarTotal() {
    setTimeout(() => {
      let forma = this.form.value
      let totalPesos = 
      parseFloat( forma.totalHospedajePesos ) + parseFloat(forma.totalTransportePesos) +
      parseFloat(forma.totalFeedingPesos) + parseFloat(forma.totalTaxiPesos);
      console.log(totalPesos);
      
      let totalDolares = 
      parseFloat( forma.totalHospedajeDolares ) + parseFloat(forma.totalTransporteDolares) +
      parseFloat(forma.totalFeedingDolares) + parseFloat(forma.totalTaxiDolares);
      this.form.patchValue({
        totalPesos,
        totalDolares
      })
    }, 500);
  }

}
