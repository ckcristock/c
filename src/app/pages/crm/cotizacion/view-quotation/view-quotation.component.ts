import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotationService } from '../quotation.service';

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent implements OnInit {
  @ViewChild('printPDF') printPDF: ElementRef
  id: number;
  quotation: any;
  loading: boolean;
  public headerData: any = {
    Titulo: 'Cotización',
    Codigo: '',
    Fecha: '',
    CodigoFormato: ''
  }
  constructor(
    private route: ActivatedRoute,
    private _quotation: QuotationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getQuotation(this.id)
    })
  }

  getQuotation(id) {
    this.loading = true;
    this._quotation.getQuotation(id).subscribe((res: any) => {
      this.quotation = res.data;
      this.headerData.Codigo = res.data.code;
      this.headerData.Fecha = res.data.created_at;
      this.headerData.CodigoFormato = res.data.format_code;
      this.loading = false;
    })
  }

  donwloading = false;
  download() {
    this.donwloading = true;
    this._quotation.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'cotización' + this.id;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloading = false;
    }),
      (error) => {
        console.log('Error downloading the file');
        this.donwloading = false;
      },
      () => {
        this.donwloading = false;
        console.info('File downloaded successfully');
      };
  }
}
