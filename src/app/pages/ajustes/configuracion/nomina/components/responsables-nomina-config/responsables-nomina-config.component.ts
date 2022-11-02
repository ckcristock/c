import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { ResponsablesNominaConfigService } from './responsables-nomina-config.service';

@Component({
  selector: 'app-responsables-nomina-config',
  templateUrl: './responsables-nomina-config.component.html',
  styleUrls: ['./responsables-nomina-config.component.scss']
})
export class ResponsablesNominaConfigComponent implements OnInit {

  loading: boolean = false;
  people: any = [];
  manager = new FormControl({});
  datos: any[] = [];
  responsable: any = {};
  busqueda: any = {
    dni: '',
    text: ''
  }
  form: FormGroup;

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
	focus$ = new Subject<string>();
	click$ = new Subject<string>();

  constructor(
    private _responsableNService: ResponsablesNominaConfigService,
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getPeopleWithDni();
    this.getPayrollManagers();
  }

  getPeopleWithDni(){
    let params = {
      ...this.busqueda
    }
    this.loading = true
    this._responsableNService.getPeopleWithDni(params)
    .subscribe((res: any)=>{
      this.loading = false;
      this.people = res.data
    })
  }

  getPayrollManagers = () => {
    this.loading = true
    this._responsableNService.getResponsablesNomina()
    .subscribe((res:any)=>{
      this.datos = res.data
      this.loading = false;
    })
  }

  inputFormatBandListValue(value: any) {
    if (value.text)
      return value.text
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.text;
  }

  search: OperatorFunction<string, readonly { text }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term)=> term.length >=3),
      map((term)=>
        this.people
          .filter((state)=> new RegExp(term).test(state.text))
          .slice(0,10)
      )
    );
		/* const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
		const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
		const inputFocus$ = this.focus$;

		return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
			map((term) =>
				(term === '' ? this.people : this.people.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10),
			),
		); */


    actualizar=(responsable, dni)=>{
      let data = {
        id: responsable.id,
        manager: dni
      }
      console.log(this.form.value)
      console.log(data);
    }

    getData = (data)=>{
      this.responsable = {...data};
      this.form.patchValue({
        id: this.responsable.id,
        area: this.responsable.area,
        manager: this.manager
      })
    }

}


/*
(focus)="focus$.next($any($event).target.value)"
                (click)="click$.next($any($event).target.value)" */
