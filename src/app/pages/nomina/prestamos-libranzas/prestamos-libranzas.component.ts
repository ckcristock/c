import { Component, OnInit } from '@angular/core';
import { LoanService } from './loan.service';
import { Subject } from 'rxjs';
import {PrestamoModel} from './modalprestamoylibranzacrear/PrestamoModel';

@Component({
  selector: 'app-prestamos-libranzas',
  templateUrl: './prestamos-libranzas.component.html',
  styleUrls: ['./prestamos-libranzas.component.scss']
})
export class PrestamosLibranzasComponent implements OnInit {

 
  public abrirModalPrestamoCrear: Subject<any> = new Subject;
  public Prestamos:PrestamoModel[] = [];
  public loadig:boolean = false;

  constructor( private _loan:LoanService ) { }

  ngOnInit() {
    this.listaPrestamo();
  }
  abrirModalPrestamo() {
    this.abrirModalPrestamoCrear.next();
  }
  listaPrestamo() {
    this.loadig=true;
     this._loan.getAll().subscribe((r:any) => {
      this.Prestamos = r.data;
      this.loadig=false;
    })
    
    //prestamoylibranza/lista_prestamos.php
  }
}
