import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import 'rxjs/add/operator/takeWhile';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DependenciesService } from 'src/app/pages/ajustes/informacion-base/services/dependencies.service';
import { GroupService } from 'src/app/pages/ajustes/informacion-base/services/group.service';
import { PositionService } from 'src/app/pages/ajustes/informacion-base/services/positions.service';
import { consts } from 'src/app/core/utils/consts';
import { MinicipalityService } from 'src/app/core/services/municipality.service';
import { DepartmentService } from 'src/app/core/services/department.service'
import { JobService } from '../job.service';
import Swal from 'sweetalert2';
import { CompanyService } from 'src/app/pages/ajustes/informacion-base/services/company.service';

@Component({
    selector: 'app-vacantes-crear',
    templateUrl: './vacantes-crear.component.html',
    styleUrls: ['./vacantes-crear.component.scss']
})

export class VacantesCrearComponent implements OnInit {

    form: FormGroup
    fecha = new Date();
    departments: any[] = [];
    municipalities: any[] = [];

    companies: any[] = [];
    groups: any[] = [];
    dependencies: any[] = [];
    positions: any[] = [];

    turns = consts.turnTypes


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

    ) { }

    ngOnInit() {
        this.createForm()
        this.getCompanies()
        this.getGroups()
        this.getDepartments()
    }

    getDepartments() {
        this._department.getDepartments().subscribe((r: any) => {
            this.departments = r.data
            this.departments.unshift({ text: 'Seleccione uno', value: '' });

        })
    }
    getMunicipalities(department_id) {
        this._municipality.getMinicipalities({ department_id }).subscribe((r: any) => {
            this.municipalities = r.data
            this.municipalities.unshift({ text: 'Seleccione uno', value: '' });
        })
    }


    validarFechas() {
        var fecha_inicio = this.form.get('date_start').value
        var fecha_fin = this.form.get('date_end').value

        if (fecha_inicio >= fecha_fin && fecha_fin != "") {
            this.form.get('date_start').patchValue('')
            this.form.get('date_end').patchValue('')
            Swal.fire({
                title: 'Fechas invalidas',
                text: 'Fecha Inicio no puede ser mayor a Fecha Fin',
                icon: 'error',
                allowOutsideClick: false,
                allowEscapeKey: false,
            })
        }
    }

    validarSalarios() {
        var salario_inferior = this.form.get('min_salary').value
        var salario_superior = this.form.get('max_salary').value
        if (salario_inferior >= salario_superior && salario_superior != "") {
            this.form.get('min_salary').patchValue('')
            this.form.get('max_salary').patchValue('')
            Swal.fire({
                title: 'Salarios invalidos',
                text: 'Salario Inferior no puede ser mayor al Superior',
                icon: 'error',
                allowOutsideClick: false,
                allowEscapeKey: false,
            })
        }
    }

    save() {

        this.form.markAllAsTouched()
        if (this.form.invalid) { return false }

        Swal.fire({
            title: '¿Seguro?',
            text: 'Se va a crear una nueva vacante',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#34c38f',
            cancelButtonColor: '#f46a6a',
            confirmButtonText: 'Si, Hazlo!'
        }).then(result => {
            if (result.value) {
                this.sendData()
            }
        });
    }

    sendData() {
        this._job.save(this.form.value).subscribe((r: any) => {
            if (r.code == 200) {
                Swal.fire({
                    title: 'Creación exitosa',
                    text: 'Felicidades, se ha creado una nueva vacante',
                    icon: 'success',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(result => {
                    if (result.value) {
                        this.router.navigateByUrl('/rrhh/vacantes')
                    }
                });
            }
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
            this.positions.unshift({ text: 'Seleccione uno', value: '' });
        })
    }
    getDependencies(company_id) {
        this._dependecies.getDependencies({ company_id }).subscribe((d: any) => {
            this.dependencies = d.data;
            this.dependencies.unshift({ text: 'Seleccione una', value: '' });
        });
    }
    getGroups() {
        this._group.getGroup().subscribe((r: any) => {
            this.groups = r.data
            this.groups.unshift({ text: 'Seleccione uno', value: '' });
        })
    }

    createForm() {
        this.form = this.fb.group({
            company_id: ['', Validators.required],
            title: ['', Validators.required],
            date_start: ['', Validators.required],
            date_end: ['', Validators.required],
            group_id: ['', Validators.required],
            dependency_id: ['', Validators.required],
            position_id: ['', Validators.required],
            department_id: ['', Validators.required],
            municipality_id: ['', Validators.required],
            min_salary: ['', Validators.required],
            max_salary: ['', Validators.required],
            turn_type: ['', Validators.required],
            description: ['', Validators.required],
            education: ['', Validators.required],
            experience_year: ['', Validators.required],
            min_age: ['', Validators.required],
            max_age: ['', Validators.required],
            can_trip: ['', Validators.required],
            change_residence: ['', Validators.required],
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
    get min_age_invalid() {
        return this.form.get('min_age').invalid && this.form.get('min_age').touched;
    }
    get max_age_invalid() {
        return this.form.get('max_age').invalid && this.form.get('max_age').touched;
    }
    get change_residence_invalid() {
        return this.form.get('change_residence').invalid && this.form.get('change_residence').touched;
    }
    get can_trip_invalid() {
        return this.form.get('can_trip').invalid && this.form.get('can_trip').touched;
    }
}
