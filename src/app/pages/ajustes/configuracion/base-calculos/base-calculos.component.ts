import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CalculationBasesService } from './calculation-bases.service';
import { SwalService } from '../../informacion-base/services/swal.service';

@Component({
  selector: 'app-base-calculos',
  templateUrl: './base-calculos.component.html',
  styleUrls: ['./base-calculos.component.scss']
})

export class BaseCalculosComponent implements OnInit {
  data = {
    administration_percentage: undefined,
    unforeseen_percentage: undefined,
    utility_percentage: undefined,
    trm: undefined,
    laser_cut_minute_value: undefined,
    warer_cut_minute_value: undefined
  }

  constructor(private _calculationBase: CalculationBasesService, private _swal :SwalService) { }

  ngOnInit(): void {
    this.getBases()
  }

  guardar(form: NgForm) {
    const data =  Object.entries(form.value);
    
    this._calculationBase.update({data}).subscribe(r => { 
      this._swal.show({
          icon:'success',
          title:'Se ha guardado con éxito',
          text:'',
          showCancel:false
      })
    });
  }

  getBases() {
    this._calculationBase.getAll().subscribe((r: any) => {
      const { data } = r

      data.forEach(el => {
        if (Object.prototype.hasOwnProperty.call(this.data, el.concept)) {
          this.data[el.concept] = el.value;
        }
      })
    })
  }

}
