import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

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
    ]  
  }

  func:any = {
    id: '',
    cc: '',
    position: '',
    passport: '',
    visa: '',
    type: ''
  }

  tipo_hoteles:any = ['Nacional','Internacional'];
  hoteles:any = []
  posicion:any;
  form: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.crearListener();
    this.hoteles = this.data.hospedaje_nacional;
  }
  
  newHospedaje() {
    let hospedaje = this.hospedajeList
    hospedaje.push(this.getBasicControl())
  }
  createForm() {
    this.form = this.fb.group({
      travel: this.fb.group({
        person_id: ['']
      }),
      hospedaje: this.fb.array([])
    });
    this.newHospedaje();
   /*  console.log(this.hospedajeList.controls[0]['controls']['hoteles']['value']); */
  }
  
  getBasicControl(): FormGroup {
    return this.fb.group({
      tipo: ['Nacional'],
      phone: [],
      rate: [],
      hoteles: [this.data.hospedaje_nacional],
      direction: [],
      n_night: []
    });
  }
  get hospedajeList() {
    return this.form.get('hospedaje') as FormArray;
  }
  
  deleteHospedaje(i) {
    this.hospedajeList.removeAt(i);
  }

  crearListener() {
    this.form.get('travel').get('person_id').valueChanges.subscribe( res => {
      this.func = this.data.funcionario.find(r => r.id == res)
    })
  }

  changeTipo(res, control:FormControl ) {
    control.patchValue({
      hoteles:  res == 'Nacional' ? this.data.hospedaje_nacional : this.data.hospedaje_internacional
    })
    
  }
  
  changeHotel(value, control) {
    let hotel = control.value.hoteles.find(res => res.id == value );
    
    control.patchValue({
      direction: hotel.direction,
      phone: hotel.phone,
      rate: hotel.rate,
      n_night: hotel.n_night
    })
  }

}
