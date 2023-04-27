import { Component, Input, OnInit } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { CertificadosService } from '../certificados.service';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss'],
})
export class CesantiasComponent implements OnInit {
  @Input() filtro: any
  layoffs: any[] = [];
  loading: boolean;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor(
    private _swal: SwalService,
    private _certificados: CertificadosService,
  ) { }

  ngOnInit(): void {
    this.getLayoffsCertificates();
  }

  getLayoffsCertificates(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._certificados.getLayoffsCertificates(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.layoffs = res.data.data;
        this.pagination.collectionSize = res.data.total;
      })
  }

  downloadSoporte(url) {
    window.open(url)
  }

  cambiarEstado(item, state) {
    let data = {
      state
    }
    this._swal.show({
      text: state == 'Aprobada' ? 'Vamos a aprobar la solicitud' : 'Vamos a rechazar la solicitud',
      title: '¿Estás seguro(a)?',
      icon: 'question',
    }).then(r => {
      if (r.isConfirmed) {
        this._certificados.updateLayoffsCertificate(item.id, data)
          .subscribe((res: any) => {
            this.getLayoffsCertificates();
            this._swal.show({
              title: res.data,
              text: state == 'Aprobada' ? 'Cesantías aporbadas con éxito' : 'Cesantías rechazada con éxito',
              icon: 'success',
              showCancel: false,
              timer: 1000
            })
          })
      }
    });
  }

  downloadComprobante(id) {
    this._certificados.downloadComprobante(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'comprobante';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
    },
      (error) => {
      },
      () => {
      })
  }
}
