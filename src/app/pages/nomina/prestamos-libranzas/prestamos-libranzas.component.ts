import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanService } from './loan.service';
import { Subject } from 'rxjs';
import { PrestamoModel } from './modalprestamoylibranzacrear/PrestamoModel';
import { MatAccordion } from '@angular/material';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
@Component({
  selector: 'app-prestamos-libranzas',
  templateUrl: './prestamos-libranzas.component.html',
  styleUrls: ['./prestamos-libranzas.component.scss']
})
export class PrestamosLibranzasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  datePipe = new DatePipe('es-CO');
  public abrirModalPrestamoCrear: Subject<any> = new Subject;
  public Prestamos: PrestamoModel[] = [];
  public loading: boolean = false;
  people: any[] = []
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filters: any = {
    person: '',
    date: '',
  }
  date: { year: number; month: number };
  constructor(
    private _loan: LoanService,
    private _people:PersonService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit() {
    this.listaPrestamo();
    this.getPeople();
  }

  selectedDate(fecha) {
    if (fecha.value){
      this.filters.date =
      this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
      ' - ' +
      this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    } else {
      this.filters.date = ''
    }
    this.listaPrestamo();
  }

  getPeople(){
    this._people.getPeopleIndex().subscribe((res:any) => {
      this.people = res.data
      this.people.unshift({ text: 'Todos', value: '' });
    })
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  abrirModalPrestamo() {
    this.abrirModalPrestamoCrear.next();
  }

  listaPrestamo(page = 1) {
    !this.filters.person ? this.filters.person = '' : ''
    this.pagination.page = page;
    this.loading = true;
    let params = {
      ...this.pagination, ...this.filters
    }
    this._loan.getAll(params).subscribe((r: any) => {
      this.Prestamos = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  download(id) {
    this._loan.download(id)
      .subscribe((response: BlobPart) => {
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
