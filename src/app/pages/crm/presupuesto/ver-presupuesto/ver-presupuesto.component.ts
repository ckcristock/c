import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../budget.service';
import { ActivatedRoute } from '@angular/router';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-presupuesto',
  templateUrl: './ver-presupuesto.component.html',
  styleUrls: ['./ver-presupuesto.component.scss']
})
export class VerPresupuestoComponent implements OnInit {
  id: string;
  data: any;
  loading:boolean;
  constructor(private _budget: BudgetService, private actRoute: ActivatedRoute, private _swal: SwalService) { }

  ngOnInit(): void {
    this.id = this.actRoute.snapshot.params.id;
    this.getBudget()
  }

  getBudget() {
    this.loading = true;
    this._budget.get(this.id).subscribe((r: any) => {
      this.data = r.data
      this.loading = false;
    })
  }

  downloadClient() {
    Swal.fire({
      inputOptions: {
        cop: 'Pesos',
        usd: 'Dolares',
      },
      inputPlaceholder: 'Seleccione una moneda',
      title: 'Se dispone a descargar el presupuesto',
      input: 'select',
      showCancelButton: true,
      confirmButtonColor: '#A3BD30',
      confirmButtonText: '¡Sí, confirmar!',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            resolve('')
          } else {
            resolve('Necesitas seleccionar un tipo de moneda')
          }
        })
      }
    }).then(r => {
      if (r.isConfirmed, r.value) {
        const data = { id: this.id, currency: r.value }

        this._budget.downloadClient(data).subscribe((response: BlobPart) => {
          let blob = new Blob([response], { type: 'application/pdf' });
          let link = document.createElement('a');
          const filename = 'proyeccion_pdf';
          link.href = window.URL.createObjectURL(blob);
          link.download = `${filename}.pdf`;
          link.click();
        }),
          (error) => {
          },
          () => {
          };
      }
    })
  }

}
