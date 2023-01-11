import { Negocio } from './negocio.interface';

const negocios: any[] = [
  {
    id: 'NZ1220',
    company: '25',
    request_name: 'Sed ut perspiciatis unde',
    date: '17 Apr, 2020',
    status: 'first',
    presupuesto: 280000,
  },
  {
    id: '#NZ1219',
    company: 'Company',
    request_name: 'Neque porro quisquam est',
    date: '15 Apr, 2019',
    status: 'first',
    presupuesto: 150000,
  },
  {
    id: '#NZ1218',
    company: 'Ecommerce App pages',
    date: '12 Apr, 2019',
    request_name: 'Itaque earum rerum hic',
    status: 'first',
    presupuesto: 1000000,
  },
  {
    id: '#NZ1217',
    company: 'Dashboard UI',
    request_name: 'In enim justo, rhoncus ut',
    date: '05 Apr, 2020',
    status: 'first',
    presupuesto: 200000,
  },
  {
    id: '#NZ1216',
    company: 'Authentication pages',
    request_name: 'Imperdiet Etiam ultricies',
    date: '02 Apr, 2020',
    status: 'second',
    presupuesto: 8000000,
  },
  {
    id: '#NZ1215',
    company: 'UI Elements pages',
    request_name: 'Cras ultricies mi eu turpis',
    date: '28 Mar, 2020',
    status: 'second',
    presupuesto: 20000000,
  },
  {
    id: '#NZ1214',
    company: 'Brand logo design',
    request_name: 'Aenean leo ligula, porttitor eu',
    date: '24 Mar, 2020',
    status: 'third',
    presupuesto: 20000000,
  },
  {
    id: '#NZ1213',
    company: 'Email pages',
    request_name: 'It will be as simple as Occidental',
    date: '20 Mar, 2020',
    status: 'third',
    presupuesto: 20000000,
  },
  {
    id: '#NZ1212',
    company: 'Forms pages',
    request_name: 'Donec quam felis, ultricies nec',
    date: '14 Mar, 2019',
    status: 'third',
    presupuesto: 20000000,
  },
];

const historial = [
  {
    icon: 'fas fa-file',
    title: 'Acción',
    created_at: '2020-11-2',
    person: {
      full_name: 'Marcos Fuentes',
      image: ''
    },
    description: 'Creacion del negocio',
  },
  {
    icon: 'fas fa-file',
    title: 'Acción',
    created_at: '2020-11-2',
    person: {
      full_name: 'Marcos Fuentes',
      image: ''
    },
    description: 'Creacion del negocio',
  },
];
export { negocios, historial as history };
