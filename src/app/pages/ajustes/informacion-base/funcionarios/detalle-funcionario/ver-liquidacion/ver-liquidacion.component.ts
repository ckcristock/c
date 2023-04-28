import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleService } from '../detalle.service';
@Component({
  selector: 'app-ver-liquidacion',
  templateUrl: './ver-liquidacion.component.html',
  styleUrls: ['./ver-liquidacion.component.scss']
})
export class VerLiquidacionComponent implements OnInit {
  id = this.route.snapshot.params.id;
  loading: boolean;
  liquidationValid: boolean = true;
  liquidation: any[] = []
  constructor(
    private route: ActivatedRoute,
    private _user: DetalleService,
  ) { }

  ngOnInit() {
    this.getPerson()
  }

  getPerson() {
    this.loading = true;
    this._user.getLiquidation(this.id).subscribe((res: any) => {
      this.loading = false;
      this.liquidation = res.data;
      if (this.liquidation["status"] != 'Liquidado') {
        this.liquidationValid = false;
      }
    })
  }

  descargar(id) {
    this._user.descargar(id).subscribe((res: any) => {

    })
  }

}
