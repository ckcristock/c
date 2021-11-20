import { Component, EventEmitter, OnInit } from '@angular/core';
import { ApuPiezaService } from '../../apu-pieza/apu-pieza.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.component.html',
  styleUrls: ['./crear-presupuesto.component.scss'],
})
export class CrearPresupuestoComponent implements OnInit {
  indirectCosts: any = [];
  sendIndirectCost = new EventEmitter<any[]>()
  forma: FormGroup;
  data = '';
 
  constructor(private _apuPieza: ApuPiezaService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.getIndirectCosts();
  }
  getIndirectCosts() {
    this._apuPieza.getIndirectCosts().subscribe((r: any) => {
      this.indirectCosts = r.data;

      if (!this.data) {
        this.sendIndirectCost.emit(r.data)
        this.indirectCostPush(this.indirecCostList);
      }

    });
  }

  createForm() {
    this.forma = this.fb.group({
      customer_id: '',
      destinity_id: '',
      line: '',
      trm: '',
      project: '',
      indirect_costs: this.fb.array([]),
      observation: '',
      items: this.fb.array([]),
     
    });


  }


  get indirecCostList() {
    return this.forma.get('indirect_costs') as FormArray;
  }

  indirectCostPush(indirect, all = true) {
    indirect.clear();
    this.indirectCosts.forEach((element) => {
      indirect.push(this.indirectCostgroup(element, this.fb, all));
    });
  }

  indirectCostgroup(el, fb: FormBuilder, all = true) {
    const optionals = all ? { percentage: [el.percentage], name: [el.text] } : {}

    let group = fb.group({
      indirect_cost_id: el.value,
      value: 0,
      ...optionals
    });

    if (all) {

      const items = this.forma.get('items') as FormArray
      group.get('percentage').valueChanges.subscribe(r => {
        
        /* Actualizar todos los subtotales de los elementos cuand cambia el porcetaje global */
        items.controls.forEach((i: FormGroup) => {
          const subItems = i.controls.subItems as FormArray
          subItems.controls.forEach((sub: FormGroup) => {
            const totalCost = sub.controls.type
            console.log(totalCost, sub);
            
            setTimeout(() => {
              totalCost.patchValue(totalCost.value)
            }, 500);
          })
        })
      })
    }


    /*  help.functionsApu.indirectCostOp(group, form); */
    return group;
  }
}
