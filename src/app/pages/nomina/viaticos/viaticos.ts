export const viaticos = {
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
      ]
}