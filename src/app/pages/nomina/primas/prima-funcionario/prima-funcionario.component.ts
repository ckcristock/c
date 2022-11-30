import { Component, OnInit } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { PrimasService } from '../primas.service';

@Component({
  selector: 'app-prima-funcionario',
  templateUrl: './prima-funcionario.component.html',
  styleUrls: ['./prima-funcionario.component.scss']
})
export class PrimaFuncionarioComponent implements OnInit {
  loading: boolean;
  empleados = {
    status: 'pendiente',
    empleados: [],
    person_payer: {
      first_name: '',
      second_name: '',
      first_surname: '',
      second_surname: '',
    }
  };


  employees: any[] = [];
  page: number;
  previousPage: number;
  paginacion = true;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0,
  }
  totalPag: any;
  periodoObs: Observable<number>;
  anioObs: Observable<number>;
  parametros: Observable<string>
  anio: any;
  periodo: any;
  lapso: any;
  funcionario: any;

  constructor(
    private _primas: PrimasService,
    private paginator: MatPaginatorIntl,
    private route: ActivatedRoute,
    private _swal: SwalService,
    private _user: UserService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";

    this.anioObs = route.params.pipe(map(p => p.anio));
    this.periodoObs = route.params.pipe(map(p => p.periodo));
    this.funcionario = this._user.user.person.id
  }

  ngOnInit(): void {
    this.page = 1;
    this.previousPage = 1;
    this.calcularPrimas();
  }

  calcularPrimas() {
    this.loading = true;
    this.anioObs.subscribe(params => this.anio = params);
    this.periodoObs.subscribe(params => this.periodo = params);

    let params: any;
    if (this.periodo == 1) {
      params = {
        fecha_inicio: new Date(`01/01/${this.anio}`),
        fecha_fin: new Date(`06/30/${this.anio}`),
        period: this.anio+'-'+this.periodo
      }
      this.lapso = ' enero - junio '
    } else {
      params = {
        fecha_inicio: new Date(`07/01/${this.anio}`),
        fecha_fin: new Date(`12/30/${this.anio}`),
        period: this.anio+'-'+this.periodo
      }
      this.lapso = ' julio - diciembre '
    }

    this._primas.setBonus(params)
      .subscribe((r: any) => {
        this.empleados = r.data;
        this.pagination.collectionSize = r.data.total_empleados;
        this.totalPag = r.data.total_empleados;
        this.loading = false;
        this.employees = this.paginate(this.empleados.empleados, 10)[0]
      });
  }

  pagar(empleados) {
    this._swal.show({
      title: 'Prima',
      text: `¿Desea pagar primas del ${this.periodo} semestre ${this.anio}? (periodo: ${this.lapso})`,
      icon: 'warning',
      showCancel: true
    }, ((res: any) => {
      if (res) {
        empleados['period'] = this.anio + '-' + this.periodo;
        empleados['funcionario'] = this.funcionario;
        empleados['status'] = 'pagado'
        //enviar petición para guardar tanto el detalle como el general,
        //primero guarda el general y con ese indice se guarda el detalle de cada funcionario
        //guardar el periodo para facilitar las revisiones futuras año-semestre
        this._primas.saveBonus(empleados)
          .subscribe((res: any) => {
            this.empleados.person_payer = res.data.responsable

            this._swal.show({
              title: 'Prima',
              text: res.data.message,
              icon: 'success',
              timer: 2000,
              showCancel: false,
            })
          })
      }
    }))
  }

  changePage(e) {
    this.employees = this.paginate(this.empleados.empleados, e.pageSize)[e.pageIndex]
  }

  paginate(arr, size) {
    return arr.reduce((acc, val, i) => {
      let idx = Math.floor(i / size)
      let page = acc[idx] || (acc[idx] = [])
      page.push(val)

      return acc
    }, [])
  }

  donwloadingExcel: boolean
  getReport() {
    let params = {
      anio: 2022,
      period: 2
    }
    this.donwloadingExcel = true;
    this._primas.getReport(params)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: 'application/excel' });
        let link = document.createElement("a");
        const filename = 'reporte-primas';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.xlsx`;
        link.click();
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
      this.donwloadingExcel = false
  }

  donwloadingPdfs: boolean
  getReportPdfs(){
    this.donwloadingPdfs = true;
    let params = {
      anio: 2022,
      period: 2
    }
    this._primas.getReportPdfs(params)
      .subscribe( (res:BlobPart)=>{
        let blob = new Blob([res], {type: 'applicarion/pdf'});
        let link = document.createElement("a");
        const filename = 'colilla-primas';
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
        this.donwloadingPdfs = false;
      }),
      err=> { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
  }

  donwloadingOne:boolean;
  getOneReportPdfs(id, period) {
    this.donwloadingOne = true;
    let params = {
      id,
      period
    }
    this._primas.getOneReportPdfs(params)
      .subscribe( (res:BlobPart)=>{
        let blob = new Blob([res], {type: 'applicarion/pdf'});
        let link = document.createElement("a");
        const filename = 'colilla-prima'+params.period;
        link.href = window.URL.createObjectURL(blob);
        link.download = `${filename}.pdf`;
        link.click();
      }),
      err=> { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
      this.donwloadingOne = false;
  }

}
