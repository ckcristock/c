import { Component, ElementRef, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Location } from "@angular/common";
import { UserService } from 'src/app/core/services/user.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from 'saturn-datepicker';
import { CompraNacionalService } from './compra-nacional.service';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-compra-nacional',
  templateUrl: './compra-nacional.component.html',
  styleUrls: ['./compra-nacional.component.scss'],
})
export class CompraNacionalComponent implements OnInit {
  @ViewChild('infoSwal') infoSwal: any;
  datePipe = new DatePipe('es-CO');
  date: { year: number; month: number };
  loading: boolean = false;
  comprasnacionales: any[] = [];
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  estadosCompra: any[] = [];
  dias_anulacion: any = '';
  funcionario_anulacion: any = '';
  funcionarios_anulacion: any = [];
  precompra: any[];
  filtros: any = {
    cod: '',
    est: '',
    prov: '',
    fecha: '',
    func: ''
  }
  requiredParams: any = { params: { tipo: "todo", funcionario: 1, company_id: '' } };

  constructor(
    private http: HttpClient,
    private _user: UserService,
    private _compraNacional: CompraNacionalService,
    private dateAdapter: DateAdapter<any>,
    private _swal: SwalService,
  ) { }


  ngOnInit() {
    this.requiredParams.params.company_id = this._user.user.person.company_worked.id
    this.dateAdapter.setLocale('es');
    this.getEstadoscompra();
    this.listarComprasNacionales();
    this.getDiasAnulacion();
    this.getFuncioriosParaResponsables();
  }

  downloading: boolean;
  download(id) {
    this.downloading = true;
    this._compraNacional.download(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'orden-compra' + id;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.downloading = false;
    }),
      (error) => {
        this.downloading = false;
      },
      () => {
        this.downloading = false;
      };
  }

  listarComprasNacionales(page = 1) {

    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros, ...this.requiredParams.params
    }
    this.loading = true;
    this._compraNacional.getListaComprasNacionales(params).subscribe((res: any) => {
      this.comprasnacionales = res.data.data;
      this.loading = false;
      this.pagination.collectionSize = res.data.total;
    });
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.filtros.fecha =
        this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd') +
        ' - ' +
        this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd');
    } else {
      this.filtros.fecha = ''
    }
    this.listarComprasNacionales();
  }



  getEstadoscompra() {
    this._compraNacional.getEstadosCompra().subscribe((res: any) => {
      this.estadosCompra = res.data;
    });
  }

  setEstadoCompra(id, estado) {
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar'
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'Vamos a ' + MENSAJE_ACCION[estado] + ' la orden de compra.',
      icon: 'question',
      showCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        let datos = {
          id: id,
          funcionario: this._user.user.id,
          estado: estado,
          motivo: ''
        }
        this._compraNacional.setEstadoCompra(datos).subscribe((res: any) => {
          this._swal.show({
            icon: res.data.tipo,
            title: res.data.titulo,
            text: res.data.mensaje,
            timer: 1000,
            showCancel: false
          });
          this.listarComprasNacionales();
        });
      }
    });
  }



  getDiasAnulacion() {
    this.http.get(environment.ruta + '/php/comprasnacionales/get_dias_anulacion.php').subscribe((data: any) => {
      this.dias_anulacion = data['Dias_Anulacion'];
      this.funcionario_anulacion = data['Funcionario_Anulacion'];
    })
  }

  getFuncioriosParaResponsables() {
    this.http.get(environment.base_url + '/php/funcionarios/lista_funcionarios?depen=admin').subscribe((res: any) => {
      this.funcionarios_anulacion = res.data;
    })
  }

  setDiasAnulacion() {

    if (this.dias_anulacion <= 0) {
      this.infoSwal.type = 'error'
      this.infoSwal.title = '¡Ha ocurrido un error!'
      this.infoSwal.text = 'El valor no puede ser menor a 1';
      this.infoSwal.show();
      return false;
    }

    let params: any = {};
    params.Dias_Anulacion = this.dias_anulacion;
    params.Funcionario_Anulacion = this.funcionario_anulacion;

    this.http.get(environment.ruta + '/php/comprasnacionales/set_dias_anulacion.php', { params: params }).subscribe((data: any) => {
      this.infoSwal.type = data.type;
      this.infoSwal.title = data.title;
      this.infoSwal.text = data.message;
      this.infoSwal.show();
    })
  }
}

