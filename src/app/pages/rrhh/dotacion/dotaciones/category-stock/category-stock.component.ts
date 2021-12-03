import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { DotacionService } from '../../dotacion.service';
import { Label } from 'ng2-charts';



@Component({
  selector: 'app-category-stock',
  templateUrl: './category-stock.component.html',
  styleUrls: ['./category-stock.component.scss']
})
export class CategoryStockComponent implements OnInit {

  constructor(private _dotation: DotacionService) { }

  @ViewChild('tablestock') private tablestock;

  @Input('loading') loading;

  nombre:string = '';
  donwloading = false;

  firstDay: any;
  lastDay: any;


  active = 1;

  ngOnInit(): void {
    this.loading = true;
    this.Graficar()
  }

  findName(){

    this.tablestock.getData();
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] = ['Categorías'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData : ChartDataSets[] = [];
  graphicData:any = {}

  Graficar() {

    // this._dotation.getDotationTotalByCategory({ cantMes: this.selectedMes }).subscribe((d: any) => {
    this._dotation.getTotatInventary(
      {
        // firstDay: this.firstDay,
        // lastDay: this.lastDay,
        // person: this.people_id,
        //  persontwo: this.people_id_two,
        //  cod: this.cod,
        //  type: this.type,
        //  delivery: this.delivery,
        //  art: this.art,

      }).subscribe((d: any) => {

    let totals: any[] = d.data;

    if (totals) {
      this.barChartData = totals.reduce((acc, el) => {
        let daSet = {data: [ el.value], label: [el.name]}
        return [ ...acc,daSet]
      }, [])
    }
    })

  }

  DownloadInventoryDotation() {
    // let params = this.getParams();
    let fecha = new Date();
    let fecha2 = new Date();
    this.firstDay = new Date(fecha.setDate(fecha.getDate() - 30)).toISOString().split('T')[0];
    this.lastDay = new Date(fecha2.setDate(fecha2.getDate())).toISOString().split('T')[0];
    let params = '';
    this.donwloading = true;
    this._dotation.DownloadInventoryDotation(this.firstDay, this.lastDay, params).subscribe((response: BlobPart) => {
    // this._dotation.downloadDotations().subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement('a');
        const filename = 'reporte_inventario';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
        this.donwloading = false;
      }),
      (error) => {
        console.log('Error downloading the file');
        this.donwloading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.donwloading = false;
      };
  }



}
