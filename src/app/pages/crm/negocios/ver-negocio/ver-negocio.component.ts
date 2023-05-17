import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegociosService } from '../negocios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalNoCloseService } from 'src/app/core/services/modal-no-close.service';
import { ApuConjuntoService } from '../../apu-conjunto/apu-conjunto.service';
import { QuotationService } from '../../cotizacion/quotation.service';
import { BudgetService } from '../../presupuesto/budget.service';
@Component({
  selector: 'app-ver-negocio',
  templateUrl: './ver-negocio.component.html',
  styleUrls: ['./ver-negocio.component.scss'],
})
export class VerNegocioComponent implements OnInit {
  @ViewChild('apus') apus: any
  active = 1;
  loading: boolean;
  contactos: any[];
  negocio: any;
  person_id;
  cotizaciones: any;
  apuSelected: any[] = [];
  business_budget_id: any = '';
  qr;
  filtros = {
    id: '',
  };
  preDataSend = {};

  form_notes: FormGroup;
  editNoteForm: FormGroup;
  editNoteBool: boolean;
  constructor(
    private ruta: ActivatedRoute,
    private _negocio: NegociosService,
    private _modal: ModalNoCloseService,
    private _sanitizer: DomSanitizer,
    private _user: UserService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private router: Router,
    private _apuConjunto: ApuConjuntoService,
    private _quotation: QuotationService,
    private _budget: BudgetService,
  ) {
    this.filtros.id = this.ruta?.snapshot?.params?.id;
    this.person_id = this._user?.user?.person?.id
  }

  ngOnInit(): void {
    this.getBussines();
    this.createFormNotes();
  }

  async getApus(e: any[]) {
    let cont = 0;
    await e?.forEach(apu => {
      const exist = this.negocio['apus']?.some(x => (x?.apuable_id == apu?.apu_id && x?.apuable?.typeapu_name == apu?.type_name))
      if (!exist) {
        this.apuSelected.push(apu)
      } else {
        cont++;
      }
    }, Promise.resolve());
    if (cont > 0) {
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: e?.length == cont ? 'No hay nada nuevo para agregar' : 'Ya agregaste alguno(s) de los APU seleccionados, agregaremos los demas',
        showCancel: false
      }).then(r => {
        if (r.isConfirmed) {
          if (this.apuSelected.length > 0) {
            this.addApu()
          }
        }
      })
    } else {
      this.addApu()
    }

  }

  openModal(content) {
    this.preDataSend = {
      text: 'Llenar',
      city_id: this.negocio?.city_id,
      third_party_id: this.negocio?.third_party_id,
      third_party_person_id: this.negocio?.third_party_person_id,
    }
    this._modal.openNoClose(content, 'xl')
  }

  editNote(item) {
    this.editNoteBool = true;
    item.hide = true;
    this.editNoteForm = this.fb.group({
      id: item?.id,
      person_id: item?.person_id,
      note: [item?.note, [Validators.required, Validators.maxLength(500)]],
      business_id: item?.business_id
    });
  }

  cancelEdit(item) {
    this.editNoteBool = false;
    item.hide = false;
    this.editNoteForm.reset();
  }

  editNoteSave(item) {
    if (this.editNoteForm.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a editar esta nota.'
      }).then(r => {
        if (r.isConfirmed) {
          this._negocio.newNote(this.editNoteForm.value).subscribe(
            (res: any) => {
              if (res?.status) {
                this.editNoteForm.patchValue({
                  note: ''
                })
                this._swal.show({
                  icon: 'success',
                  title: res?.data,
                  text: '',
                  showCancel: false,
                  timer: 1000
                })
                this.cancelEdit(item);
                this._negocio.getNotes(this.filtros.id).subscribe((res: any) => {
                  this.negocio.notes = res?.data[0]
                })
              }
            }
          )
        }
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'No puedes publicar una nota vacía o con más de 500 caracteres',
        showCancel: false
      })
    }
  }

  addApu() {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'Agregaremos ' + this.apuSelected?.length + ' APU a este negocio.'
    }).then(r => {
      if (r.isConfirmed) {
        let data = {
          business_id: this.filtros?.id,
          apus: this.apuSelected,
          person_id: this.person_id
        }
        this._negocio.newBusinessApu(data).subscribe(data => {
          this.getBussines();
          this.apuSelected = [];
        });
      }
    })

  }

  findApus() {
    this.apuSelected = [];
    this.apus.openConfirm()
  }

  changeState(event) {
    this._negocio.changeState({ status: event?.value }, this.filtros?.id).subscribe(() => {
      this._swal.show({
        icon: 'success',
        title: 'Operación exitosa',
        text: 'Etapa cambiada con éxito',
        showCancel: false,
        timer: 1000
      })
    });
  }

  openNewTab(route, id = '') {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([route + '/' + id])
    );
    window.open(url, '_blank');
  }

  createFormNotes() {
    this.form_notes = this.fb.group({
      person_id: [this.person_id],
      note: ['', [Validators.required, Validators.maxLength(500)]],
      business_id: [this.filtros?.id]
    });
  }

  saveNote() {
    if (this.form_notes.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar esta nota.'
      }).then(r => {
        if (r.isConfirmed) {
          this._negocio.newNote(this.form_notes.value).subscribe(
            (res: any) => {
              if (res?.status) {
                this.form_notes.patchValue({
                  note: ''
                })
                this._swal.show({
                  icon: 'success',
                  title: res?.data,
                  text: '',
                  showCancel: false,
                  timer: 1000
                })
                this._negocio.getNotes(this.filtros.id).subscribe((res: any) => {
                  this.negocio.notes = res?.data[0]
                })
              }
            }
          )
        }
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'No puedes publicar una nota vacía o con más de 500 caracteres',
        showCancel: false
      })
    }
  }

  openConfirm(confirm) {
    this._modal.openNoClose(confirm, 'xl')
  }

  changeStatusInBusiness(status, item, label) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'Vamos a cambiar el estado. ' +
        ((status == 'Aprobado' || status == 'Aprobada') ?
          ('Al aprobar ' + (label == 'quotation' ? 'una cotización' : 'un presupuesto') + ' el resto se rechazarán automáticamente.') : ''),

    }).then(r => {
      if (r.isConfirmed) {
        let data = {
          item: item,
          status: status,
          label: label
        }
        this._negocio.changeStatusQyB(data).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Correcto',
            text: 'Se ha cambiado el estado correctamente',
            showCancel: false,
            timer: 1000
          })
          this.getBussines()
        })
      }
    })
  }

  getBussines() {
    this.loading = true;
    this._negocio.getBusiness(this.filtros.id).subscribe((res: any) => {
      this.qr = this._sanitizer?.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + res?.code)
      this.negocio = res?.data;
      this.loading = false;
    })
    this.business_budget_id = this.ruta?.snapshot?.params?.id;
  }

  addNewApuPieza(apu) {
    this._modal.close();
    this._apuConjunto.getApuPartToAdd(apu?.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }

  addNewAPUConjunto(apu) {
    this._modal.close();
    this._apuConjunto.getApuSetToAdd(apu?.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }

  addNewAPUServicio(apu) {
    this._modal.close();
    this._apuConjunto.getApuServiceToAdd(apu?.id).subscribe((res: any) => {
      this.getApus(res?.data)
    })
  }
  addNewQuotation(quot) {
    this._modal.close();
    this._quotation.getQuotationToAdd(quot?.id).subscribe((res: any) => {
      this.cotizacionesSeleccionadas.push({
        quotation_id: res?.data?.id,
        business_id: this.filtros?.id,
        total_cop: res?.data?.total_cop
      });
      let data = {
        business_id: this.filtros?.id,
        quotations: this.cotizacionesSeleccionadas,
        person_id: this.person_id
      }
      this._negocio.newBusinessQuotation(data).subscribe((res: any) => {
        this.getBussines();
        this.cotizacionesSeleccionadas = [];
        this._swal.show({
          icon: 'success',
          title: 'Cotizaciones agregadas',
          text: res?.data,
          showCancel: false
        })
      });
    })
  }

  presupuestosSeleccionados: any[] = [];
  cotizacionesSeleccionadas: any[] = [];
  addNewBudget(pre) {
    this._modal.close();
    this._budget.getBudgetToAdd(pre?.id).subscribe((res: any) => {
      this.presupuestosSeleccionados.push({
        budget_id: res?.data?.id,
        business_budget_id: this.filtros?.id,
        total_cop: res?.data?.total_cop
      });
      let data = {
        business_id: this.filtros?.id,
        budgets: this.presupuestosSeleccionados,
        person_id: this.person_id
      }
      this._negocio.newBusinessBudget(data).subscribe((res: any) => {
        this.getBussines();
        this.presupuestosSeleccionados = [];
        this._swal.show({
          icon: 'success',
          title: 'Presupuestos agregados',
          text: res?.data,
          showCancel: false
        })
      });
    })
  }
}
