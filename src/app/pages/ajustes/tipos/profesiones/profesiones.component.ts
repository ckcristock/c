import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesionesService } from './profesiones.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { timer } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-profesiones',
  templateUrl: './profesiones.component.html',
  styleUrls: ['./profesiones.component.scss']
})
export class ProfesionesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  form: FormGroup;
  professions: any[] = [];
  profession: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private fb: FormBuilder,
    private _professions: ProfesionesService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getProfessions();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset()
    
  }

  createForm() {
    this.form = this.fb.group({
      /* id:[] */
      name: ['', Validators.required]
    });
  }

  getProfessions(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._professions.getProfessions(this.pagination)
      .subscribe((res: any) => {
        this.loading = false;
        this.professions = res.data.data;
        this.pagination.collectionSize = res.total;
      })
  }

  createProfession() {
    this._professions.createNewProfession(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getProfessions();
      this._swal.show({
        title: 'Creada con éxito',
        text: "¡La profesión ha sido creada!",
        icon: 'success',
        timer: 1000,
        showCancel: false
      });
    });
  }

  activateOrInactivate(profession, state) {
    let data = {
      id: profession.id,
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (state === 'Inactivo' ? '¡La profesión será desactivada!' : '¡La profesión será activada!'),
      icon: 'question',
      showCancel: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._professions.createNewProfession(data).subscribe((r: any) => {
            this.getProfessions();
          })
          this._swal.show({
            title: (state === 'Inactivo' ? '¡Profesión inhabilitada!' : 'Profesión activada!'),
            text: (state === 'Inactivo' ? 'La profesión ha sido inhabilitada con éxito.' : 'La profesión ha sido activada con éxito.'),
            icon: 'success',
            showCancel: false,
            timer: 1000
          }) 
        }
      })
  }

}
