import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from '../../ajustes/informacion-base/persons/person.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { CertificadosService } from './certificados.service';
import { functionsUtils } from '../../../core/utils/functionsUtils';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.scss'],
})
export class CertificadosComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('laboralchild') laboralChild: any;
  @ViewChild('cesantiaschild') cesantiaschild: any;
  formLaboral: FormGroup;
  formCesantias: FormGroup;
  matPanel = false;
  closeResult = '';
  people: any[] = []
  pdfCargado: boolean = false;
  pdfString: any = '';
  pdfType: any = '';
  pdfFyle: any = '';
  reason_withdrawal: any[] = []
  requisitos: any = ''
  filtroLaboral: any = {
    name: '',
  }
  filtroCesantias: any = {
    name: '',
  }
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _certificados: CertificadosService,
    private _swal: SwalService,
    private _people: PersonService,
  ) { }

  ngOnInit(): void {
    this.createFormLaboral();
    this.createFormCesantias();
    this.getPeople();
    this.getPeople2();
    this.getReasonLayoffs();
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  getRequisitos(r) {
    this.requisitos = r
  }
  //certificado laboral requiere funcionario tiene vigencia de 30 días el boton de descargar pero se muestran todos con paginacion, se pide informacion a mostrar dirigido a motivo de la solicitud

  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.requisitos = ''
    this.pdfCargado = false;
    this.pdfFyle = '';
    this.formCesantias.get('document').setValue('');
    this.formLaboral.reset();
    this.formCesantias.reset();
  }


  getReasonLayoffs() {
    this._certificados.getReasonLayoffs().subscribe((res: any) => {
      this.reason_withdrawal = res.data
    })
  }
  peopleFiltro: any

  getPeople() {
    this._people.getPeopleIndex().subscribe((res: any) => {
      this.people = res.data;
    })
  }

  getPeople2() {
    this._people.getPeopleIndex().subscribe((res: any) => {
      this.peopleFiltro = res.data;
      this.peopleFiltro.unshift({ text: 'Todos', value: '' });
    })
  }

  newLaboral() {
    this._certificados.createNewWorkCertificate(this.formLaboral.value)
      .subscribe((res: any) => {
        if (res.data) {
          this.modalService.dismissAll();
          this._swal.show({
            title: 'Certificado generado con éxito',
            icon: 'success',
            text: '',
            timer: 1000,
            showCancel: false
          })
          this.laboralChild.getWorkCertificates();
        } else if (res.err) {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: res.err,
            showCancel: false
          })
        }

      },
        (error: any) => {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: error.data.err,
            showCancel: false
          })
        })
  }

  newCesantia() {
    this._certificados.createNewLayoffsCertificate(this.formCesantias.value)
      .subscribe((res: any) => {
        if (res.data) {
          this.modalService.dismissAll();
          this._swal.show({
            title: 'Solicitud generada con éxito',
            icon: 'success',
            text: '',
            timer: 1000,
            showCancel: false
          })
          this.cesantiaschild.getLayoffsCertificates();
        } else if (res.err) {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: res.err,
            showCancel: false
          })
        }

      },
        (error: any) => {
          this._swal.show({
            title: 'Error',
            icon: 'error',
            text: error.data.err,
            showCancel: false
          })
        })
  }

  createFormLaboral() {
    this.formLaboral = this.fb.group({
      information: ['', Validators.required],
      person_id: ['', Validators.required],
      reason: ['', Validators.required],
      addressee: ['']
    })
  }

  createFormCesantias() {
    this.formCesantias = this.fb.group({
      reason_withdrawal: ['', Validators.required],
      person_id: ['', Validators.required],
      reason: ['', Validators.required],
      document: ['', Validators.required],
      file_name: [''],
      monto: [''],
      valormonto: [''],
    })
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      this.pdfCargado = true
      let file = event.target.files[0];
      this.formCesantias.get('file_name').setValue(file.name);
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.pdfString = (<FileReader>event.target).result;
        const type = { ext: this.pdfString };
        this.pdfType = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.pdfFyle = base64;
        this.formCesantias.get('document').setValue(this.pdfFyle);
      });
      this.formCesantias.get('document').valid
    }
  }

  get person_is_valid() {
    return (
      this.formLaboral.get('person_id').invalid && this.formLaboral.get('person_id').touched
    );
  }
  get person_is_valid2() {
    return (
      this.formCesantias.get('person_id').invalid && this.formCesantias.get('person_id').touched
    );
  }
}
