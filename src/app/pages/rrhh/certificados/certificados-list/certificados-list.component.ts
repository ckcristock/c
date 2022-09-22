import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CertificadosService } from '../certificados.service';

@Component({
  selector: 'app-certificados-list',
  templateUrl: './certificados-list.component.html',
  styleUrls: ['./certificados-list.component.scss']
})
export class CertificadosListComponent implements OnInit {
  @Input() filtro: any
  certificates: any[] = [];
  loading: boolean;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }

  constructor(
    private _certificados: CertificadosService,
  ) { }

  ngOnInit(): void {
    this.getWorkCertificates();
  }

  getWorkCertificates(page = 1) {
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._certificados.getWorkCertificates(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.certificates = res.data.data;
        this.pagination.collectionSize = res.data.total;
      })
  }

  download(id) {
    this._certificados.downloadLaboral(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'certificado';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
    },
      (error) => {
        console.log('Error downloading the file');
      },
      () => {
        console.info('File downloaded successfully');
      })
  }
}
