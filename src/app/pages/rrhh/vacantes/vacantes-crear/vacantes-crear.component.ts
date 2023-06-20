import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/takeWhile';
import { Router } from '@angular/router';
import { DependenciesService } from 'src/app/pages/ajustes/informacion-base/services/dependencies.service';
import { GroupService } from 'src/app/pages/ajustes/informacion-base/services/group.service';
import { PositionService } from 'src/app/pages/ajustes/informacion-base/services/positions.service';
import { consts } from 'src/app/core/utils/consts';
import { MinicipalityService } from 'src/app/core/services/municipality.service';
import { DepartmentService } from 'src/app/core/services/department.service'
import { JobService } from '../job.service';
import Swal from 'sweetalert2';
import { CompanyService } from 'src/app/pages/ajustes/informacion-base/services/company.service';
import { isArraysEqual } from '@fullcalendar/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-vacantes-crear',
  templateUrl: './vacantes-crear.component.html',
  styleUrls: ['./vacantes-crear.component.scss']
})

export class VacantesCrearComponent implements OnInit {
  @Input('edit') edit;
  form: FormGroup
  fecha = new Date();
  loading: boolean = false;
  departments: any[] = [];
  masks = consts;
  municipalities: any[] = [{ text: 'Primero selecciona un departamento', value: '', disabled: true }];
  companies: any[] = [];
  groups: any[] = [];
  dependencies: any[] = [{ text: 'Primero selecciona un grupo', value: '', disabled: true }];
  positions: any[] = [{ text: 'Primero selecciona una dependencia', value: '', disabled: true }];
  contracts: any[] = [];
  visas: any[] = [];
  licenses: any[] = [];
  documents: any[] = [];
  salaries: any[] = [];
  educations = [
    { value: 'Preescolar', name: 'Preescolar' },
    { value: 'Educación básica primaria', name: 'Educación básica primaria' },
    { value: 'Educación básica secundaria', name: 'Educación básica secundaria' },
    { value: 'Educación media', name: 'Educación media' },
    { value: 'Educación técnica y tecnológica', name: 'Educación técnica y tecnológica' },
    { value: 'Educación universitaria', name: 'Educación universitaria' },
    { value: 'Especialización', name: 'Especialización' },
    { value: 'Maestría', name: 'Maestría' },
    { value: 'Doctorado', name: 'Doctorado' }
  ];


  turns = consts.turnTypes;
  options = consts.options;
  rangeSalary: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _dependecies: DependenciesService,
    private _group: GroupService,
    private _position: PositionService,
    private _municipality: MinicipalityService,
    private _department: DepartmentService,
    private _job: JobService,
    private _company: CompanyService,
    private _swal: SwalService,

  ) { }

  async ngOnInit() {
    this.loading = true;
    this.createForm()
    this.getCompanies()
    this.getGroups()
    this.getDepartments()
    this.getContractType();
    this.getVisaTypes();
    this.getDrivingLicenses();
    this.getDocumentTypes();
    await this.getSalaryTypes();
    this.edit ? this.pullJob() : '';
    this.loading = false;
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      company_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.maxLength(500)]],
      date_start: ['', Validators.required],
      date_end: ['', Validators.required],
      group_id: ['', Validators.required],
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      department_id: ['', Validators.required],
      municipality_id: ['', Validators.required],
      min_salary: [''],
      max_salary: [''],
      turn_type: ['', Validators.required],
      description: ['', Validators.required],
      education: ['', Validators.required],
      experience_year: ['', Validators.required],
      min_age: [18, Validators.min(18)],
      max_age: [65, Validators.min(18)],
      can_trip: ['', Validators.required],
      change_residence: ['', Validators.required],
      gener: ['No aplica', Validators.required],
      languages: ['', Validators.required],
      conveyance: ['Ninguno'],
      work_contract_type_id: ['', Validators.required],
      document_type_id: ['', Validators.required],
      passport: ['', Validators.required],
      visa: ['', Validators.required],
      visa_type_id: [''],
      salary_type_id: [1],
      driving_license: ['No aplica'],
    })
    this.form.get('group_id').valueChanges.subscribe(v => {
      this.getDependencies(v);
    })
    this.form.get('dependency_id').valueChanges.subscribe(v => {
      this.getPosition(v)
    })
    this.form.get('department_id').valueChanges.subscribe(v => {
      this.getMunicipalities(v)
    })
    this.form.get('visa').valueChanges.subscribe(v => {
      v == 1 ? this.form.get('visa_type_id').disable() : this.form.get('visa_type_id').enable()
    })
  }

  pullJob() {
    this.form.patchValue({
      ...this.edit,
      date_start: moment(this.edit.date_start).format('YYYY-MM-DD'),
      date_end: moment(this.edit.date_end).format('YYYY-MM-DD'),
      group_id: this.edit.position?.dependency?.group?.id,
      dependency_id: this.edit.position?.dependency_id,
      department_id: this.edit.municipality?.department_id

    })
  }


  async getSalaryTypes() {
    await this._job.getSalaryTypes().toPromise().then((r: any) => {
      this.salaries = r.data;
    })
  }

  getDocumentTypes() {
    this._job.getDocumentTypes().subscribe((r: any) => {
      this.documents = r.data;
    })
  }

  getDrivingLicenses() {
    this._job.getDrivingLicenses().subscribe((r: any) => {
      this.licenses = r.data;
    })
  }

  getVisaTypes() {
    this._job.getVisaTypes().subscribe((r: any) => {
      this.visas = r.data;
    })
  }

  getContractType() {
    this._job.getContractTypes().subscribe((r: any) => {
      this.contracts = r.data;
    })
  }

  getDepartments() {
    this._department.getDepartments().subscribe((r: any) => {
      this.departments = r.data
      this.departments.unshift({ text: 'Selecciona uno', value: '', disabled: true });

    })
  }
  getMunicipalities(department_id) {
    this._municipality.getMinicipalities({ department_id }).subscribe((r: any) => {
      this.municipalities = r.data
      this.municipalities.unshift({ text: 'Selecciona uno', value: '', disabled: true });
    })
  }


  validarFechas() {
    var fecha_inicio = this.form.get('date_start').value
    var fecha_fin = this.form.get('date_end').value

    if (fecha_inicio >= fecha_fin && fecha_fin != "") {
      this.form.get('date_start').patchValue('')
      this.form.get('date_end').patchValue('')
      this._swal.show({
        title: 'Fechas invalidas',
        text: 'La fecha de inicio no puede ser mayor a la fecha de fin',
        icon: 'error',
        showCancel: false,
      });

    }
  }

  validarSalarios() {
    var salario_inferior = this.form.get('min_salary').value
    var salario_superior = this.form.get('max_salary').value
    if (salario_inferior >= salario_superior && salario_superior != "") {
      this.form.get('min_salary').patchValue('')
      this.form.get('max_salary').patchValue('')
      this._swal.show({
        title: 'Salarios invalidos',
        text: 'El salario inferior no puede ser mayor al superior',
        icon: 'error',
        showCancel: false,
      })
    }
  }

  save() {
    console.log(this.form.value)
    if (this.form.invalid) {
      this._swal.incompleteError();
      this.form.markAllAsTouched()
    } else {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a crear una nueva vacante',
        icon: 'question',
      }).then(result => {
        if (result.isConfirmed) {
          this.sendData()
        }
      });
    }
  }

  sendData() {
    this._job.save(this.form.value).subscribe((r: any) => {
      if (r.status) {
        this._swal.show({
          text: 'Se ha creado una nueva vacante',
          title: 'Creación exitosa',
          icon: 'success',
          showCancel: false,
          timer: 1000
        })
        this.router.navigateByUrl('/rrhh/vacantes')
      } else {
        this._swal.hardError();
      }
    },
      error => {
        this._swal.hardError();
      })
  }
  getCompanies() {
    this._company.getCompanies().subscribe((d: any) => {
      this.companies = d.data;
      d.data[0]
        ? this.form.patchValue({ company_id: d.data[0].value })
        : '';
    });
  }
  getPosition(dependency_id) {
    this._position.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data
      this.positions.unshift({ text: 'Selecciona uno', value: '', disabled: true });
    })
  }
  getDependencies(group_id) {
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Selecciona una', value: '', disabled: true });
    });
  }
  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data
      this.groups.unshift({ text: 'Selecciona uno', value: '', disabled: true });
    })
  }



  get company_id_invalid() {
    return (this.form.get('company_id').invalid && this.form.get('company_id').touched);
  }
  get title_invalid() {
    return this.form.get('title').invalid && this.form.get('title').touched;
  }
  get date_start_invalid() {
    return this.form.get('date_start').invalid && this.form.get('date_start').touched;
  }
  get date_end_invalid() {
    return this.form.get('date_end').invalid && this.form.get('date_end').touched;
  }
  get group_id_invalid() {
    return this.form.get('group_id').invalid && this.form.get('group_id').touched;
  }
  get dependency_id_invalid() {
    return this.form.get('dependency_id').invalid && this.form.get('dependency_id').touched;
  }
  get position_id_invalid() {
    return this.form.get('position_id').invalid && this.form.get('position_id').touched;
  }
  get department_id_invalid() {
    return this.form.get('department_id').invalid && this.form.get('department_id').touched;
  }
  get municipality_id_invalid() {
    return this.form.get('municipality_id').invalid && this.form.get('municipality_id').touched;
  }
  get min_salary_invalid() {
    return this.form.get('min_salary').invalid && this.form.get('min_salary').touched;
  }
  get max_salary_invalid() {
    return this.form.get('max_salary').invalid && this.form.get('max_salary').touched;
  }
  get turn_type_invalid() {
    return this.form.get('turn_type').invalid && this.form.get('turn_type').touched;
  }
  get description_invalid() {
    return this.form.get('description').invalid && this.form.get('description').touched;
  }
  get education_invalid() {
    return this.form.get('education').invalid && this.form.get('education').touched;
  }
  get experience_year_invalid() {
    return this.form.get('experience_year').invalid && this.form.get('experience_year').touched;
  }
  get change_residence_invalid() {
    return this.form.get('change_residence').invalid && this.form.get('change_residence').touched;
  }
  get can_trip_invalid() {
    return this.form.get('can_trip').invalid && this.form.get('can_trip').touched;
  }

  get gener_invalid() {
    return this.form.get('gener').invalid && this.form.get('gener').touched;
  }

  get languages_invalid() {
    return this.form.get('languages').invalid && this.form.get('languages').touched;
  }

  get conveyance_invalid() {
    return this.form.get('conveyance').invalid && this.form.get('conveyance').touched;
  }

  get contractType_invalid() {
    return this.form.get('work_contract_type_id').invalid && this.form.get('work_contract_type_id').touched;
  }

  get documentType_invalid() {
    return this.form.get('document_type_id').invalid && this.form.get('document_type_id').touched;
  }

  get passport_invalid() {
    return this.form.get('passport').invalid && this.form.get('passport').touched;
  }

  get visa_invalid() {
    return this.form.get('visa').invalid && this.form.get('visa').touched;
  }

  get visaType_invalid() {
    return this.form.get('visa_type_id').invalid && this.form.get('visa_type_id').touched;
  }
}
