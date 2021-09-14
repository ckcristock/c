import { Component, OnInit } from '@angular/core';
import { LoanService } from './loan.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-prestamos-libranzas',
  templateUrl: './prestamos-libranzas.component.html',
  styleUrls: ['./prestamos-libranzas.component.scss']
})
export class PrestamosLibranzasComponent implements OnInit {

 
  public abrirModalPrestamoCrear: Subject<any> = new Subject;
  public Prestamos:any = [];
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
    /* this._loan.getAll().subscribe((data:any) => {
      this.Prestamos = data;
      this.loadig=false;
    }) */
    
    //prestamoylibranza/lista_prestamos.php
  }
}
