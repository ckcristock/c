import { Component, OnInit, ViewChild, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  @ViewChild('restoreModal') restoreModal
  @Input('canExit') canExit: any;
  newPassword: string;
  hide = true;
  form: FormGroup
  constructor(public _user: UserService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private fb: FormBuilder,
    private _swal: SwalService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: this._user.user.id,
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
    })
  }



  ngAfterViewInit() {
    if (this._user.user.change_password == true) {
      this.openConfirm(this.restoreModal)

    }
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true })
  }
  /* private getDismissReason(reason: any) {

  } */

  changePassword() {
    this.form.patchValue({
      id: this._user.user.id,
    })
    this._user.changePassword(this.form.value).subscribe(d => {
      this.modalService.dismissAll();
      this._swal.show({
        icon: 'success',
        title: 'Operacion exitosa',
        text: 'Tu contraseña se ha actualizado con exito, presiona "OK" y vuelve a iniciar sesión',
        showCancel: false
      }).then((result) => {
        if (result.isConfirmed) {
          this._user.logout();
        }
      })
    }, err => {
      Swal.fire('Ha ocurrido un error', '', 'error')
    });

  }



}
