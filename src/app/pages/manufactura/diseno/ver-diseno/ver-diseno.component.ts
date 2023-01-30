import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { DisenoService } from '../../services/diseno.service';

@Component({
  selector: 'app-ver-diseno',
  templateUrl: './ver-diseno.component.html',
  styleUrls: ['./ver-diseno.component.scss']
})
export class VerDisenoComponent implements OnInit, OnDestroy {
  work_order_id: string;
  loading: boolean;
  work_order: any;
  days;
  hours;
  minutes;
  seconds;
  await_chrono: boolean;
  interval;
  view_button: boolean = false;
  person_id;

  constructor(
    private route: ActivatedRoute,
    private _work_order_design: DisenoService,
    private _user: UserService,
    private _swal: SwalService
  ) {
    this.person_id = _user.user.person.id
   }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.work_order_id = params.get('id');
      this.getWorkOrder();
    })
  }

  getWorkOrder() {
    this.loading = true
    this._work_order_design.getWorkOrder(this.work_order_id).subscribe((res: any) => {
      this.work_order = res.data;
      this.loading = false;
      this.view_button = this.work_order.people.some(x => x.pivot.person_id == this.person_id);
      if (this.work_order.status == 'proceso') {
        this.await_chrono = true;
        this.interval = setInterval(() => {
          let now = new Date();
          let start_time = new Date(this.work_order.start_time);
          this.difference(now, start_time)
        }, 1000);
        setTimeout(() => {
          this.await_chrono = false;
        }, 1500)
      } else if (this.work_order.status == 'completado') {
        clearInterval(this.interval)
        let end_time = new Date(this.work_order.end_time);
        let start_time = new Date(this.work_order.start_time);
        this.difference(end_time, start_time)
      }
    })
  }

  changeStatus(status) {
    this._swal.show({
      icon: 'question',
      title: status == 'proceso' ? 'Comenzar fase de diseño' : 'Finalizar fase de diseño',
      text: status == 'proceso' ?
        'Recuerda que empezaremos a contabilizar el tiempo transcurrido desde este momento hasta que finalices la tarea.' :
        'Revisa todos los datos, la orden de producción pasará a fase de producción.'
    }).then(r => {
      if (r.isConfirmed) {
        let data = {
          status: status
        }
        this._work_order_design.changeStatus(data, this.work_order_id).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: r.data,
            text: '',
            showCancel: false,
            timer: 1000
          });
          this.getWorkOrder();
        })
      }
    })
  }

  difference(d1, d2) {
    this.seconds = Math.floor((d1.getTime() - (d2.getTime())) / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);
    this.days = Math.floor(this.hours / 24);
    this.hours = this.hours - (this.days * 24);
    this.minutes = this.minutes - (this.days * 24 * 60) - (this.hours * 60);
    this.seconds = this.seconds - (this.days * 24 * 60 * 60) - (this.hours * 60 * 60) - (this.minutes * 60);
  }

}
