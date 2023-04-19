import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraNacionalService } from '../compra-nacional.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ver-compra-nacional',
  templateUrl: './ver-compra-nacional.component.html',
  styleUrls: ['./ver-compra-nacional.component.scss']
})
export class VerCompraNacionalComponent implements OnInit {
  activities: any[] = [];
  Compra: any[] = [];
  Lista_Rechazo: any[] = [];
  datosCabecera: any = {}
  loading: boolean;
  id: any;
  user_id = this._user.user.id;
  permission: Permissions = {
    menu: 'Órdenes de compra',
    permissions: {
      show: true,
      approve: true
    }
  };

  constructor(
    private route: ActivatedRoute,
    private _user: UserService,
    private _permission: PermissionService,
    private _swal: SwalService,
    private _compras: CompraNacionalService
  ) {
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.getTipoRechazo();
      this.getData();
    })
  }

  getTipoRechazo() {
    this._compras.getTipoRechazo().subscribe((res: any) => {
      res.data.forEach(value => { this.Lista_Rechazo[value.Id_Tipo_Rechazo] = value.Nombre });
    });
  }

  getData() {
    this.loading = true;
    let params = {
      id: this.id
    }
    this._compras.getDatosComprasNacionales(params).subscribe((res: any) => {
      this.Compra = res.data;
      this.activities = res.data.activity
      this.datosCabecera = {
        Fecha: res.data.created_at,
        Codigo: res.data.Codigo,
        Titulo: res.data.Estado,
        CodigoFormato: res.data.format_code
      }
      this.loading = false;
    });
  }

  downloading: boolean;

  download(id) {
    this.downloading = true;
    this._compras.download(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'orden-compra' + id;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.downloading = false;
    }),
      (error) => {
        console.log('Error downloading the file');
        this.downloading = false;
      },
      () => {
        console.info('File downloaded successfully');
        this.downloading = false;
      };
  }

  async EstadoAprobacion(Estado) {
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar',
      Aprobada: 'aprobar'
    }
    let decision = (Estado == "Rechazada") ?
      Swal.fire({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a rechazar la orden de compra, selecciona un motivo.',
        icon: 'question',
        input: 'select',
        inputOptions: this.Lista_Rechazo,
        inputPlaceholder: 'Selecciona',
        showCancelButton: true,
        confirmButtonText: 'Rechazar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: this._swal.buttonColor.confirm,
        cancelButtonColor: this._swal.buttonColor.cancel,
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise(function (resolve) {
            if (value !== '') {
              resolve('');
            } else {
              resolve('Selecciona un motivo.');
            }
          });
        }
      })
      :
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a ' + MENSAJE_ACCION[Estado] + ' la orden de compra' + ((Estado == 'Aprobada') ? ' para proceder a solicitarla' : ''),
        icon: 'question',
        showCancel: true
      })

    decision.then((result) => {
      if (result.isConfirmed) {
        let datos = {
          id: this.id,
          estado: Estado,
          funcionario: this.user_id,
          motivo: (Estado == "Rechazada") ? result.value : ''
        }
        this._compras.setEstadoCompra(datos).subscribe((res: any) => {
          this._swal.show({
            icon: res.data.tipo,
            title: res.data.titulo,
            text: res.data.mensaje,
            timer: 1000,
            showCancel: false
          })
          this.ngOnInit();
        })
      }
    })
  }
}
