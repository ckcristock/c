import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-editar-presupuesto',
  templateUrl: './editar-presupuesto.component.html',
  styleUrls: ['./editar-presupuesto.component.scss']
})
export class EditarPresupuestoComponent implements OnInit {

  id: string;
  data: any;
  loading = false
  constructor( private actRoute: ActivatedRoute,private _budget: BudgetService ) { }
  
  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getData();
  }
  
  getData(){
    this.loading = true
    this._budget.get(this.id).subscribe((r:any) => {
      this.data = r.data;
      this.loading = false
    })
  }

}
