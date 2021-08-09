import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataDinamicService } from '../../../../data-dinamic.service';
import { OpenAgendaService } from '../../../agendamiento/open-agenda.service';
import { PersonService } from './person.service';
import { Observable, ReplaySubject } from 'rxjs';
import {functionsUtils} from '../../../../core/utils/functionsUtils';
@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  @ViewChild('newModal') newModal

  person: any = {
    type_identification_id: '',
    identification: '',
    first_name: '',
    second_name: '',
    first_surname: '',
    second_surname: '',
    birth_day: '',
    civil_state: '',
    email: '',
    telphone: '',
    celphone: '',
    Ips: '',
    departament_id: '',

    municipality_id: '',
    companies: [],
    medical_register: '',
    person_type_id: '',
    specialities: []
  }
  image_blob: any;
  signature_blob: any;

  companies: any = []

  specialities: any = []

  peopleTypes: any = [];
  typesDocuments: Array<any> = []
  civilStates: Array<any> = [
    { name: 'Seleccione', value: '' },
    { name: 'Soltero/a', value: 'Soltero/a' },
    { name: 'Casado/a', value: 'Casado/a' },
  ]
  pagination = {
    pageSize: 20,
    page: 1,
    collectionSize: 40,

  }
  filters: any = {

    date: '',
    institution: '',
    patient: '',
    speciality: '',

  }
  searching = false;
  searchFailed = false;
  persons = [{
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'VIDASER EU',
    company: 'Company Test',
    state: 'Activo'
  }, {
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'MEDISERRRANO',
    company: 'Company Test',
    state: 'Activo'
  }, {
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'MEGSALUD',
    company: 'Company Test',
    state: 'Activo'
  }, {
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'SALUDVITAL',
    company: 'Company Test',
    state: 'Activo'

  }, {
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'HEMOPLIFE',
    company: 'Company Test',
    state: 'Activo'

  }, {
    identification: '1222334',
    names: 'Jhoe Due',
    city: 'ECOMEDIS',
    company: 'Company Test',
    state: 'Activo'
  }
  ]

  specialties: any = [];
  cities: any = [];
  departments: any = [];
  municipalities: any = [];
  locations: any = [];
  saving = false;
  constructor(private _dataDinamic: DataDinamicService, private _person: PersonService) {

  }

  ngOnInit(): void {
  }
  base64Output = ''
  onFileSelected(e, fileInput) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    functionsUtils.fileToBase64(file).subscribe(base64 => {
      this.base64Output = base64;
      console.log(this.base64Output);
    });
    /* reader.onload = this._handleReaderLoaded.bind(this); */
    // reader.readAsDataURL(file);

  }
  imageSrc = ''
 

  guardar(form: NgForm) {
    this.saving = true;
    let values = form.value
    let sendForm = new FormData();
    /*  for (const key in values) {
       console.log(key,values[key]);
       sendForm.append(key+'', values[key]+'')
     } */


    sendForm.append('image', 'SDASD')
    this._person.storePeople(form.value).subscribe(r => {
      console.log(r);
    })
  }

  getData() {
    this.getDepartments();
    this.getSpecialties();
    this.getCompanies();
    this.getPeopleTypes();
    this.getTypeDocuments();
  }


  getCities(department) {
    if (department) {
      this._dataDinamic.getCities({ department_id: department.value }).subscribe((req: any) => {
        this.cities = req.data
        this.cities.unshift({ text: 'Seleccione', value: '' })
      })
    }
  }

  async getDepartments() {
    await this._dataDinamic.getDepartments().toPromise().then((req: any) => {
      this.departments = req.data
      this.departments.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getPeopleTypes() {
    this._dataDinamic.getPeopleTypes().subscribe((req: any) => {
      this.peopleTypes = req.data
      this.peopleTypes.unshift({ text: 'Seleccione', value: '' })
    })
  }

  getCompanies() {
    this._dataDinamic.getCompanies(1).subscribe((req: any) => {
      this.companies = req.data
      /*   this.companies.unshift({ text: 'Seleccione', value: '' }) */
    })
  }

  getSpecialties() {
    this._dataDinamic.getSpecialties('', '').subscribe((resp: any) => {
      this.specialities = resp.data;
    });
  }

  getTypeDocuments() {
    this._dataDinamic.getTypeDocuments().subscribe((resp: any) => {
      this.typesDocuments = resp.data;
      this.typesDocuments.unshift({ text: 'Seleccione', value: '' })
    });
  }

}
