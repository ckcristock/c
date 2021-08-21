import { Component, OnInit, ViewChild, Input, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {
  @ViewChild('restoreModal') restoreModal 
  @Input('canExit') canExit:any;
  
  newPassword:string;
  constructor(public _user : UserService,
    private router: Router
    
    ) { }

  ngOnInit(): void {
   
  }

  ngAfterViewInit(){
    if (this._user.user.change_password == true) {
      this.restoreModal.show() 
    } 
  }

  changePassword(){
     console.log(this.newPassword);
  
     let parm = {id:this._user.user.id,
                 newPassword:this.newPassword}

     this._user.changePassword(parm).subscribe(d=>{
       
        Swal.fire('Operacion exitosa','Felicidades, su contraseña se ha actualizado','success')
        this._user.logout();
       /*  this.router.navigateByUrl('/'); */

     },err=>{
       console.log('error');
        Swal.fire('Ha ocurrido un error','','error')
     });
     
  }

}
