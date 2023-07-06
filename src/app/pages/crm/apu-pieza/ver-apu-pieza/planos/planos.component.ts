import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { ApuPiezaService } from '../../apu-pieza.service';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.scss']
})
export class PlanosComponent implements OnInit {
  @Input('data') data;
  @Input('info') info;
  @Output() actualizar = new EventEmitter;
  env = environment?.production
  constructor(
    private _swal: SwalService,
    private _apu_service: ApuPiezaService
  ) { }

  ngOnInit(): void {
  }

  borrarPlano(event, item) {
    this._swal?.show({
      title: '¿Estás seguro(a)?',
      icon: 'question',
      text: 'Vamos a eliminar este plano',
    }).then(x => {
      if (x?.isConfirmed) {
        this._apu_service?.deleteFile(item?.id).subscribe((res: any) => {
          this._swal?.show({
            icon: 'success',
            title: res?.data,
            text: '',
            showCancel: false,
            timer: 1000
          })
          this.actualizar?.emit()
        })
      }
    })
    event?.preventDefault();
    event?.stopPropagation();
  }
}
