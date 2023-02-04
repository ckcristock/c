import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfilesApuService } from 'src/app/pages/ajustes/parametros/apu/perfiles-apu/perfiles-apu.service';
import { PersonService } from '../../../../persons/person.service';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-profile-permissions',
  templateUrl: './profile-permissions.component.html',
  styleUrls: ['./profile-permissions.component.scss']
})
export class ProfilePermissionsComponent implements OnInit {
  @Input('personId') personId;
  form: FormGroup;
  apu_profiles: any[] = [];
  saving: boolean

  constructor(
    private _apu_profiles: PerfilesApuService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private _person: PersonService
  ) { }

  ngOnInit(): void {
    this.getProfiles();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      apu_profile_id: ['', Validators.required]
    })
    this.getProfile();
  }

  getProfiles() {
    let params = {
      full: true
    }
    this._apu_profiles.getProfilesIdex(params).subscribe((res: any) => {
      this.apu_profiles = res.data
    })
  }

  getProfile() {
    this._person.getProfile(this.personId).subscribe((res: any) => {
      this.form.patchValue({
        apu_profile_id: res.data
      })
    })
  }

  save() {
    this.saving = true;
    this._person
      .updatePerson(this.form.value, this.personId)
      .subscribe(r => {
        this.saving = false;
        this._swal.show({
          icon: 'success',
          title: 'Correcto',
          text: 'Perfil asignado con éxito',
          showCancel: false,
          timer: 1000
        });
      })
  }

}
