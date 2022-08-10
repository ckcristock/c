import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfilesApuService } from './perfiles-apu.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfiles-apu',
  templateUrl: './perfiles-apu.component.html',
  styleUrls: ['./perfiles-apu.component.scss']
})
export class PerfilesApuComponent implements OnInit {

  @ViewChild('modal') modal: any;
  form: FormGroup;
  loading: boolean = false;
  title: any = '';
  profiles: any[] = [];
  profile: any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor(
    private fb: FormBuilder,
    private _profiles: PerfilesApuService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createform();
    this.getProfiles();
  }

  createform() {
    this.form = this.fb.group({
      id: [this.profile.id],
      profile: [''],
      value_time_daytime_displacement: [0],
      value_time_night_displacement: [0],
      daytime_ordinary_hour_value: [0],
      night_ordinary_hour_value: [0],
      sunday_daytime_value: [0],
      sunday_night_time_value: [0]
    });
    this.subscribes(this.form);
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModal() {
    this.modal.show();

  }

  getProfile(profile) {
    this.profile = { ...profile };
    this.form.patchValue({
      id: this.profile.id,
      profile: this.profile.profile,
      value_time_daytime_displacement: this.profile.value_time_daytime_displacement,
      value_time_night_displacement: this.profile.value_time_night_displacement,
      daytime_ordinary_hour_value: this.profile.daytime_ordinary_hour_value,
      night_ordinary_hour_value: this.profile.night_ordinary_hour_value,
      sunday_daytime_value: this.profile.sunday_daytime_value,
      sunday_night_time_value: this.profile.sunday_night_time_value
    })
    this.subscribes(this.form);
  }

  getProfiles(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._profiles.getProfiles(this.pagination).subscribe((r: any) => {
      this.profiles = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  subscribes(form: FormGroup) {
    form.get('value_time_daytime_displacement').valueChanges.subscribe(value => {
      let result = (value * 1.5);
      form.patchValue({ value_time_night_displacement: Math.round(result) });
    });
    form.get('daytime_ordinary_hour_value').valueChanges.subscribe(value => {
      let resultSunday = (value * 1.75);
      let resultOrdinary = (value * 1.5);
      let result = (value * 2.1);
      form.patchValue({
        night_ordinary_hour_value: Math.round(resultOrdinary),
        sunday_daytime_value: Math.round(resultSunday),
        sunday_night_time_value: Math.round(result)
      });
    });
  }

  activateOrInactivate(profile, state) {
    let data = { id: profile.id, state }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El perfil será desactivada!' : 'el perfil será Activada'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._profiles.save(data).subscribe((r: any) => {
            this.getProfiles();
          })
          this._swal.show({
            icon: 'success',
            title: '¡Activado!',
            text: (data.state == 'Activo' ? 'El perfil ha sido Activada con éxito.' : 'El perfil ha sido desactivada con éxito.'),
            timer: 2500,
            showCancel: false
          })
        }
      })
  }

  save() {
    this._profiles.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll(); 
      this.form.reset();
      this.getProfiles();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }


}
