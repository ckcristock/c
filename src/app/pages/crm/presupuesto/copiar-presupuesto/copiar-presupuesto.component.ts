import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BudgetService } from '../budget.service';

@Component({
  selector: 'app-copiar-presupuesto',
  templateUrl: './copiar-presupuesto.component.html',
  styleUrls: ['./copiar-presupuesto.component.scss']
})
export class CopiarPresupuestoComponent implements OnInit {
  id: string;
  data: any;
  loading = false
  constructor(
    private actRoute: ActivatedRoute,
    private _budget: BudgetService
  ) {
    this.id = this.actRoute.snapshot.params.id;
  }

  ngOnInit(): void {
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
