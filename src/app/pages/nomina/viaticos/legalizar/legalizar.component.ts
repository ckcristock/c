import { Component, OnDestroy,ElementRef, OnInit } from '@angular/core';
import { VerViaticosService } from '../ver-viaticos/ver-viaticos.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LegalizarDataService } from './legalizar-data.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-legalizar',
  templateUrl: './legalizar.component.html',
  styleUrls: ['./legalizar.component.scss']
})
export class LegalizarComponent implements OnInit, OnDestroy {
  loading = false;
  data: any = {};
  id: string;
  viaticos$: Subscription;

  constructor(
    private _viaticos: VerViaticosService,
    private location: Location,
    private route: ActivatedRoute,
    private _viaticosData:LegalizarDataService
  ) {}
  

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.viaticos$ = this._viaticosData.viaticos.subscribe(r=>{
      this.data = r;
    })

    this.getViatico();
  }

  getViatico() {
    this.loading = true;
    this._viaticos.getAllViaticos(this.id).subscribe((r: any) => {
      this.loading = false;
      this._viaticosData.viaticos.next(r.data);
    });
  }

  regresar() {
    this.location.back();
  }

  get validHotel(){
    if (this.data?.hotels?.length) {
      return  ! this.data.hotels.some( hotel =>  this.valid(hotel.reported) || this.valid(hotel.file)   )
    }
    return true;
  }
  get validTransport(){
    if (this.data?.transports?.length) {
      return  ! this.data.transports.some( transport =>  this.valid(transport.reported) || this.valid(transport.file)   )
    }
    return true;
  }
  get validTaxi(){
    if (this.data?.transports?.length) {
      return  ! this.data.expense_taxi_cities.some( taxi =>  this.valid(taxi.reported) || this.valid(taxi.file)   )
    }
    return true;
  }

 ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
  }
 
  valid(variable){
  return ( variable  === undefined || variable  === null || variable === '')
  }
}
