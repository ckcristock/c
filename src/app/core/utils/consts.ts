export const consts = {
  degree: [
    { clave: 'Primaria', valor: 'Primaria' },
    { clave: 'Secundaria', valor: 'Secundaria' },
    { clave: 'Técnica', valor: 'Técnica' },
    { clave: 'Tecnológica', valor: 'Tecnológica' },
    { clave: 'Profesional', valor: 'Profesional' },
    { clave: 'Especialización', valor: 'Especialización' },
    { clave: 'Maestría', valor: 'Maestría' },
  ],
  maritalStatus: [
    { clave: 'Soltero(a)', valor: 'Soltero(a)' },
    { clave: 'Casado(a)', valor: 'Casado(a)' },
    { clave: 'Divorciado(a)', valor: 'Divorciado(a)' },
    { clave: 'Viudo(a)', valor: 'Viudo(a)' },
    { clave: 'Unión Libre(a)', valor: 'Unión Libre(a)' },
  ],
  contract_type: [
    { clave: 'Indefinido', valor: 1 },
    { clave: 'Fijo', valor: 2 }
  ],
  work_contract_type: [
    { clave: 'Indefinido', conclude: 0 },
    { clave: 'Fijo', conclude: 1 }
  ],
  bonusType: [
    { clave: 'Constitutivo', valor: 'Constitutivo' },
    { clave: 'No Constitutivo', valor: 'No Constitutivo' }
  ],
  driving_requirements: [
    { text: 'A1', value:'A1' },
    { text: 'A2', value:'A2' },
    { text: 'B1', value:'B1' },
    { text: 'B2', value:'B2' },
    { text: 'B3', value:'B3' }
  ],
  bloodType: [
    { clave: 'A+', valor: 'A+' },
    { clave: 'A-', valor: 'A-' },
    { clave: 'B+', valor: 'B+' },
    { clave: 'B-', valor: 'B-' },
    { clave: 'O+', valor: 'O+' },
    { clave: 'O-', valor: 'O-' },
    { clave: 'AB+', valor: 'AB+' },
    { clave: 'AB-', valor: 'AB-' },
  ],
  diasSemana: [
    {
      id: 1,
      text: 'Lunes',
      value: 'Monday',
    },
    {
      id: 1,
      text: 'Martes',
      value: 'Tuesday',
    },
    {
      id: 1,
      text: 'Miercoles',
      value: 'Wednesday',
    },
    {
      id: 1,
      text: 'Jueves',
      value: 'Thursday',
    },
    {
      id: 1,
      text: 'Viernes',
      value: 'Friday',
    },
    {
      id: 1,
      text: 'Sabado',
      value: 'Saturday',
    },
    {
      id: 1,
      text: 'Domingo',
      value: 'Sunday',
    },
  ],
  turnTypes: [
    { text: 'Fijo', value: 'Fijo', isRotative: 0 },
    { text: 'Rotativo', value: 'Rotativo', isRotative: 1 },
  ],
  shueSizes: [
    { text: '35', value: '35' },
    { text: '36', value: '36' },
    { text: '37', value: '37' },
    { text: '38', value: '38' },
    { text: '39', value: '39' },
    { text: '40', value: '40' },
    { text: '41', value: '41' },
    { text: '42', value: '42' },
    { text: '43', value: '43' },
    { text: '44', value: '44' },
    { text: '45', value: '45' },
  ],
  pantSizes: [
    { text: '28', value: '28' },
    { text: '30', value: '30' },
    { text: '32', value: '32' },
    { text: '34', value: '34' },
    { text: '36', value: '36' },
    { text: '38', value: '38' },
    { text: '38', value: '38' },
    { text: '40', value: '40' },
  ],
  shirtSize: [
    { text: 'XS', value: 'XS' },
    { text: 'S', value: 'S' },
    { text: 'M', value: 'M' },
    { text: 'L', value: 'L' },
    { text: 'XL', value: 'XL' },
    { text: 'XXL', value: 'XXL' },
  ],

  meses: [
    { id: 1, name: "Enero" },
    { id: 2, name: "Febrero" },
    { id: 3, name: "Marzo" },
    { id: 4, name: "Abril" },
    { id: 5, name: "Mayo" },
    { id: 6, name: "Junio" },
    { id: 7, name: "Julio" },
    { id: 8, name: "Agosto" },
    { id: 9, name: "Septiembre" },
    { id: 10, name: "Octubre" },
    { id: 11, name: "Noviembre" },
    { id: 12, name: "Diciembre" }
  ],

  status: [
    { clave: 'Abierto', valor: 'Abierto' },
    { clave: 'Cerrado', valor: 'Cerrado' }
  ]

};
