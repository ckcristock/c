import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  @ViewChild('restoreModal') restoreModal
  @Input('canExit') canExit: any;

  newPassword: string;
  form: FormGroup
  constructor(public _user: UserService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private fb: FormBuilder
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    if (this._user.user.change_password == true) {
      this.openConfirm(this.restoreModal)
      this.form = this.fb.group({
        id: this._user.user.id,
        newPassword: ['', Validators.required]
      })
    }
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true })
  }
  /* private getDismissReason(reason: any) {

  } */

  changePassword() {

    let parm = {
      id: this._user.user.id,
      newPassword: this.newPassword
    }

    this._user.changePassword(parm).subscribe(d => {

      Swal.fire('Operacion exitosa', 'Felicidades, su contraseña se ha actualizado', 'success')
      this.modalService.dismissAll();
      this._user.logout();
      /*  this.router.navigateByUrl('/'); */

    }, err => {
      Swal.fire('Ha ocurrido un error', '', 'error')
    });

  }

}
