import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of, Observable, Subject, concat } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, map, catchError, filter } from 'rxjs/operators';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';

@Component({
  selector: 'app-crear-cotizacion',
  templateUrl: './crear-cotizacion.component.html',
  styleUrls: ['./crear-cotizacion.component.scss']
})
export class CrearCotizacionComponent implements OnInit {
  public datos: any = {
    Titulo: 'Nueva cotización',
    Fecha: new Date()
  }
  form: FormGroup
  cities: any[] = []

  constructor(
    private _apuPieza: ApuPiezaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm()
    this.getCities()
    this.loadApuParts()
  }

  apuPart$: Observable<any>;
  apuPartLoading = false;
  apuPartInput$ = new Subject<string>();
  minLengthTerm = 3;

  loadApuParts() {
    this.apuPart$ = concat(
      of([]), // default items
      this.apuPartInput$.pipe(
        filter((res: any) => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(600),
        tap(() => this.apuPartLoading = true),
        switchMap(name => {
          return this._apuPieza.getClient({ name }).pipe(
            map((r: any) => { return r.data }),
            catchError(() => of([])), // empty list on error
            tap(() => this.apuPartLoading = false)
          )
        })
      )
    );
  }


  createForm() {
    this.form = this.fb.group({
      customer_id: '',
      destinity_id: '',
      line: '',
      trm: '',
      project: '',
      money_type: '',
      indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
      total_cop: 0,
      total_usd: 0,
      unit_value_prorrateado_cop: 0,
      unit_value_prorrateado_usd: 0,
    });


  }

  getCities() {
    this._apuPieza.getCities().subscribe((r: any) => {
      this.cities = r.data;
    })
  }

  save() {

  }

}
