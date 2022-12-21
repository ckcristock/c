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
  public headerData:any = {
    Titulo: 'Balance general',
    Codigo: '',
    Fecha: ''
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

  getQuotation(id){
    this.loading = true;
    this._quotation.getQuotation(id).subscribe((res:any) => {
      this.quotation = res.data;
      this.headerData.Codigo = 'COT' + res.data.id
      this.headerData.Fecha = res.data.created_at
      this.loading = false;
    })
  }

  print(){
    console.log(this.printPDF)
  }
}
