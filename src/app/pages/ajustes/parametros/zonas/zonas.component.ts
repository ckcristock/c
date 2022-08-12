import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Zones } from './zonas';
import { ZonasService } from './zonas.service';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss']
})
export class ZonasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  zones: any = [];
  zone: any = {};
  selected: any;
  form: FormGroup;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  status: any = 'Inactivo';
  loading: boolean = false;
  constructor(private zonesService: ZonasService, private fb: FormBuilder,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getAllZones();
    this.createForm();
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllZones(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this.zonesService.getAllZones(this.pagination)
      .subscribe((res: any) => {
        this.loading = false;
        this.zones = res.data.data;
        this.pagination.collectionSize = res.data.total
      })
  }

  open(modal) {
    //this.modal.show();
    this.openConfirm(modal)
    this.form.reset();
    this.selected = 'Nueva zona';
  }

  getZone(zone, modal) {
    this.zone = { ...zone };
    this.selected = 'Actualizar zona'
    this.form.patchValue({
      id: this.zone.id,
      name: this.zone.name
    });
    this.openConfirm(modal)
  }

  createForm() {
    this.form = this.fb.group({
      id: this.zone.id,
      name: ['', Validators.required]
    })
  }

  anularOActivar(zone, status) {

    let data: any = {
      id: zone.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo' ? 'La zona se inactivará!' : 'La zona se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: (status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar')
    }).then((result) => {
      if (result.isConfirmed) {
        this.zonesService.createZone(data)
          .subscribe(res => {
            this.getAllZones();
            Swal.fire({
              title: (status === 'Inactivo' ? 'Zona Inhabilitada!' : 'Zona activada'),
              text: (status === 'Inactivo' ? 'La zona ha sido Inhabilitada con éxito.' : 'La zona ha sido activada con éxito.'),
              icon: 'success'
            })
          })
      }
    })
  }

  createZone() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    this.zonesService.createZone(this.form.value)
      .subscribe((res: any) => {
        this.getAllZones();
        //this.modal.hide();
        this.modalService.dismissAll(); 
        Swal.fire({
          title: res.data,
          icon: 'success',
          allowOutsideClick: false,
          allowEscapeKey: false,
        })
      })
  }

  get name_valid() {
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }

}
