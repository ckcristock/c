import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { viaticos } from '../viaticos';
import { CrearViaticosService } from './crear-viaticos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-crear-viaticos',
  templateUrl: './crear-viaticos.component.html',
  styleUrls: ['./crear-viaticos.component.scss']
})
export class CrearViaticosComponent implements OnInit {
  func:any = {
    id: '',
    identifier: '',
    position: '',
    passport_number: '',
    visa: '',
    type: ''
  }
  hospedaje_nacional:any;
  hospedaje_internacional:any;
  origen = viaticos.origen;
  trayecto_nacional:any;
  trayecto_internacional:any;
  // trayecto:any = ['Seleccione', 'Aeropuerto-Casa', 'Aeropuerto-Embajada', 'Aeropuerto-Maquinados', 'Aeropuerto-Terminal'];
  city:any = ['Seleccione', 'BQA', 'BOG', 'MED', 'MAR', 'Otra ciudad'];
  tipo:any = ['Seleccione', 'Nacional','Internacional'];
  tipo_transporte:any = ['Ida', 'Vuelta'];
  hotels:any = [];
  hotels_inter:any = [];
  taxis:any = [];
  people:any[] = [];
  person_selected:any;
  form: FormGroup
  constructor( 
                private fb: FormBuilder, 
                private location: Location,
                private crearViaticoService: CrearViaticosService
                ) { }

  ngOnInit(): void {
    this.createForm();
    this.crearListener();
    this.getPeople();
    this.getHotels();
    this.getRouteTaxi();
    /* this.hoteles = this.hospedaje_nacional; */
  }
  
  regresar() {
    this.location.back();
  }

  getPeople() {
    this.crearViaticoService.getPeople()
    .subscribe( (res:any) => {
      this.people = res.data;
    })
  }

  crearListener() {
    this.form.get('travel').get('person_id').valueChanges.subscribe( res => {
      this.func = this.people.find(r => r.id == res)
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
        person_id: [''],
        origin: [''],
        destiny: [''],
        travel_type: [''],
        departure_date: [''],
        arrival_date: [''],
        n_nights: ['']
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
    console.log(this.form.value);
    
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
      total:  [0],
      breakfast: [],
      who_cancels:[],
      accommodation: ['Sencilla']
    });
    group.get('hotel_id').valueChanges.subscribe( value => {
      let hotel = group.get('hoteles').value.find(res => res.id == value);
      group.patchValue({
        address: hotel.address,
        phone: hotel.phone,
        rate: hotel.simple_rate,
        breakfast: hotel.breakfast
      })
    })
    group.get('accommodation').valueChanges.subscribe( value => {
      let hotel = group.get('hoteles').value.find(res => res.accommodation == value);
      group.patchValue({
        rate: value == 'Sencilla' ? hotel.simple_rate : hotel.double_rate
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
  
  getHotels() {
    this.crearViaticoService.getHotels()
    .subscribe( (res:any) =>{
      this.hospedaje_nacional = res.data;
      this.hospedaje_internacional = res.code;
    })
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
      hoteles:  res == 'Nacional' ? this.hospedaje_nacional : this.hospedaje_internacional
    })
  }

  /***************** TRANSPORTE TERRESTRE ****************/  

  getTransporteControl(): FormGroup{
    let group = this.fb.group({
      type: ['Ida'],
      journey: [],
      company: [],
      ticket_payment: [],
      departure_date: [],
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
      type: ['Seleccione'],
      journey: ['Seleccione'],
      city: ['Seleccione'],
      rate: [0],
      journeys: [0],
      total: [0]
    })
    group.get('type').valueChanges.subscribe( value => {
      group.patchValue({
        journey: value == 'Nacional' ? this.trayecto_nacional : this.trayecto_internacional
      })
      console.log(this.taxiList);
    
    }) 
    /* group.get('journey').valueChanges.subscribe( value => {
      let city =  group.value;
      group.patchValue({
        total: totalTaxi
      })
    }) */
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

 /*  getTaxis() {
    this.crearViaticoService.getTaxis()
    .subscribe( (res:any) =>{
      this.taxis = res.data;
    })
  } */

  getCities() {
    this.crearViaticoService.getCity()
  }

  getRouteTaxi() {
    this.crearViaticoService.getRouteTaxi()
    .subscribe( (res:any) =>{
        this.trayecto_internacional = res.code;
        this.trayecto_nacional = res.data;
    })
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

  /***************** FEEDING ****************/ 
  
  getFeedindControl(): FormGroup {
    let group = this.fb.group({
      type: ['Seleccione'],
      personType: [],
      breakfast: [],
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

  crearViatico() {
    this.crearViaticoService.crearViatico(this.form.value)
    .subscribe( (res:any) =>{
      Swal.fire({
        icon: 'success',
        title: 'Viatico creado con éxito'
      })
    },
    err => {
      Swal.fire({
        icon: 'error',
        title: '¡Ooops!',
        text: err.code
      })
    }
    )
  }

}
