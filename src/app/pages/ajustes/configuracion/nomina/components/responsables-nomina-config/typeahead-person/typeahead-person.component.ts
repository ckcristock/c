import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NominaConfigService } from '../../../nomina-config.service';

@Component({
  selector: 'app-typeahead-person',
  templateUrl: './typeahead-person.component.html',
  styleUrls: ['./typeahead-person.component.scss']
})
export class TypeaheadPersonComponent implements OnInit {
  @Input('data') datos;
  @Input('variable') variable;
  @Input('titulo') titulo;
  @Output('setAccount') setAccount = new EventEmitter<any>();
  searching: boolean;
  searchFail: boolean;

  constructor(
    private _nominaService: NominaConfigService
  ) { }

  ngOnInit(): void {
  }

  formatterName = (responsable: {identifier: string, text: string}) => responsable.text;

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    tap(() => {
      this.searching = true;
      this.searchFail = false;
    }),
    switchMap((term) =>
      this._nominaService.getPeopleWithDni({ search: term }).pipe(
        tap((res) => {
          if (res.length==0) {
            this.searchFail = true;
          }
        }),
        catchError(() => {
          this.searchFail = true;
          return of([]);
        })
      )
    ),
    tap(() => (this.searching = false))
  );

  fijarResponsable = (datos, codigo) =>{
    this.setAccount.emit({datos: datos, identifier : codigo});
  }
}
