import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { environment } from 'src/environments/environment';
import { ApuConjuntoService } from '../../apu-conjunto.service';

@Component({
  selector: 'app-planos-conjunto',
  templateUrl: './planos-conjunto.component.html',
  styleUrls: ['./planos-conjunto.component.scss']
})
export class PlanosConjuntoComponent implements OnInit {
  @Input('data') data;
  @Input('info') info;
  @Output() actualizar = new EventEmitter;
  env = environment.production
  constructor(
    private _swal: SwalService,
    private _apu_conjunto: ApuConjuntoService
  ) {}

  ngOnInit(): void {
  }

  borrarPlano(event, item) {
    this._swal.show({
      title: '¿Estás seguro(a)?',
      icon: 'question',
      text: 'Vamos a eliminar este plano',
    }).then(x => {
      if (x.isConfirmed) {
        this._apu_conjunto.deleteFile(item.id).subscribe((res: any) => {
          this._swal.show({
            icon: 'success',
            title: res.data,
            text: '',
            showCancel: false,
            timer: 1000
          })
          this.actualizar.emit()
        })
      }
    })
    event.preventDefault();
    event.stopPropagation();
  }

}
