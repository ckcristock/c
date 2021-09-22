import { Component, OnInit } from '@angular/core';
import { LoanService } from './loan.service';
import { Subject } from 'rxjs';
import {PrestamoModel} from './modalprestamoylibranzacrear/PrestamoModel';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-prestamos-libranzas',
  templateUrl: './prestamos-libranzas.component.html',
  styleUrls: ['./prestamos-libranzas.component.scss']
})
export class PrestamosLibranzasComponent implements OnInit {

 
  public abrirModalPrestamoCrear: Subject<any> = new Subject;
  public Prestamos:PrestamoModel[] = [];
  public loading:boolean = false;
  ruta = environment.base_url;
  constructor( private _loan:LoanService ) { }

  ngOnInit() {
    this.listaPrestamo();
  }
  abrirModalPrestamo() {
    this.abrirModalPrestamoCrear.next();
  }
  listaPrestamo() {
    this.loading=true;
     this._loan.getAll().subscribe((r:any) => {
      this.Prestamos = r.data;
      this.loading=false;
    })
    
    //prestamoylibranza/lista_prestamos.php
  }

  download(id){
    this._loan.download(id)
    .subscribe( (response: BlobPart) => {
      let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        const filename = 'proyeccion_pdf';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.loading = false
      }), 
      error => { console.log('Error downloading the file'); this.loading = false },
        () => { console.info('File downloaded successfully'); this.loading = false };
    }
}
