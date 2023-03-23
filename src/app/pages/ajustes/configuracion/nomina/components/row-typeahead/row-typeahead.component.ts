import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-row-typeahead',
  templateUrl: './row-typeahead.component.html',
  styleUrls: ['./row-typeahead.component.scss']
})
export class RowTypeaheadComponent implements OnInit {
  @Input('extra') datos;
  @Input('variable') variable;
  @Input('titulo') titulo;
  @Output('setAccount') setAccount = new EventEmitter<any>();
  searching: boolean;
  searchFail: boolean;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  formatter = (cuentas: { Nombre_Niif: string, Codigo_Niif: string }) => cuentas.Codigo_Niif + ' - ' + cuentas.Nombre_Niif;

  search_cuenta_niif = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.searching = true;
        this.searchFail = false;
      }),
      switchMap(term =>
        this.http.get(`${environment.base_url}/php/plancuentas/filtrar_cuentas.php?`, { params: { coincidencia: term } }).pipe(
          tap((res: Array<{ Nombre_Niif: string, Codigo_Niif: string }>) => {
            if (res.length == 0) {
              this.searchFail = true
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

  fijarCuenta = (datos, codigo) => {
    this.setAccount.emit({ datos: datos, identifier: codigo });
  }

}
