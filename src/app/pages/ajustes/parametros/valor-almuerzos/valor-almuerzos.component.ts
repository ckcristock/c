import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ValorAlmuerzosService } from './valor-almuerzos.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-valor-almuerzos',
  templateUrl: './valor-almuerzos.component.html',
  styleUrls: ['./valor-almuerzos.component.scss']
})
export class ValorAlmuerzosComponent implements OnInit {
  data = {
    value: undefined
  }
  constructor( private _lunchValues: ValorAlmuerzosService, private _swal: SwalService) { }

  ngOnInit(): void {
    this.getValue();
  }

  guardar(form: NgForm) {
    this._lunchValues.update(form.value).subscribe(r => { 
      this.getValue();
      this._swal.show({
          icon:'success',
          title:'Se ha guardado con éxito',
          text:'',
          showCancel:false
      })
    });
  }

  getValue() {
    this._lunchValues.getAll().subscribe((data: any) => {
      this.data.value = data.data.value;
    })
  }

}
