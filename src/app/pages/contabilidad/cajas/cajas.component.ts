import { Component, EventEmitter, OnInit } from '@angular/core';
import {PrettyCashService} from 'src/app/core/services/pretty-cash.service';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html',
  styleUrls: ['./cajas.component.scss']
})
export class CajasComponent implements OnInit {
  newPrettyCash = new EventEmitter<Boolean>();
  loading:boolean = false;
  prettyCashList : any[] =  [];
  constructor( private _prettyCash:PrettyCashService) { }

  ngOnInit(): void {
    this.getPrettyCash();
  }

  getPrettyCash(){
    this.loading = true;
    this._prettyCash.getAll().subscribe( (r:any)=>{
      this.prettyCashList = r.data
      this.loading = false;
    } )
  }
}
