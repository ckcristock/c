import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
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
  //form: FormGroup;
  model:any = {};
  searchFailed = false;
  searching = false;
  datos: any[] = [];
  dato:any = {};

  constructor(
    private _responsableNService: ResponsablesNominaConfigService,
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getPayrollManagers();
  }

  getPayrollManagers = () => {
    this.loading = true
    this._responsableNService.getResponsablesNomina()
    .subscribe((res:any)=>{
      this.datos = res.data
      this.loading = false;
    })
  }

  /* createForm=(dato)=>{
    this.form = this.fb.group({
      area: this.dato.area,
      manager: this.dato.manager
    })
  }
 */
  formatter = (responsable: {identifier: string, text: string}) => responsable.text;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    tap(() => {
      this.searching = true;
      this.searchFailed = false;
    }),
    switchMap((term) =>
      this._responsableNService.getPeopleWithDni({ search: term }).pipe(
        tap((res) => {
          if (res.length==0) {
            this.searchFailed = true;
          }
        }),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        })
      )
    ),
    tap(() => (this.searching = false))
  );

  actualizar=(responsable, identifier)=>{
    let data = {
      id: responsable.id,
      manager: identifier
    }
    console.log(data)
    this._responsableNService.createUpdatePayrollManager(data)
      .subscribe((res:any)=>{

        this._swal.show({
          title: 'Responsable de Nómina',
          icon: 'success',
          text: res.data,
          timer: 1000
        })
      })
  }

}
