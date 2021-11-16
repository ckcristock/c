import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const piecesSetsHelper = {

  createFillInPiecesSets(form: FormGroup, fb: FormBuilder, data, apuParts:Array<any>) {
    if (data.setpartlist) {
      let list_pieces_sets = form.get('list_pieces_sets') as FormArray;
      data.setpartlist.forEach((r) => {
        let group = fb.group({
          apu_type: [r.apu_type],
          apu_id: [r.apu_id],
          unit: [r.unit],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total]
        });
        this.subscribePiecesSets(group, form, list_pieces_sets, apuParts);
        list_pieces_sets.push(group);
      });
    }
  },

  createPiecesSetsGroup(form: FormGroup, fb: FormBuilder, apuParts:Array<any>, apuSets:Array<any>) {
    let setpartlist = fb.group({
      apu_type: [''],
      apu_id: [''],
      unit: [''],
      amount: [0],
      unit_cost: [0],
      total: [0]
    });
    let list = form.get('list_pieces_sets') as FormArray;
    this.subscribePiecesSets(setpartlist, form, list, apuParts, apuSets);
    return setpartlist;
  },

  subscribePiecesSets( group: FormGroup, form:FormGroup, list: FormArray, apuParts:Array<any>, apuSets:Array<any>){
    group.get('apu_id').valueChanges.subscribe(value => {
      let type = group.get('apu_type').value;
      let data = (type == 'pieza' ? apuParts.find(a => a.id == value) : apuSets.find(a => a.id == value));
      console.log(data);
      
      /* if (type == 'pieza') {
        let data = apuParts.find(a => a.id == value)
      } */
      group.patchValue({
        unit_cost: data.unit_direct_cost
      });
    });
    group.get('amount').valueChanges.subscribe(value => {
      let unit_cost = group.get('unit_cost').value;
      group.patchValue({
        total: unit_cost * value
      })
    });
    group.get('unit_cost').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      group.patchValue({
        total: value * amount
      })
    });
    group.get('total').valueChanges.subscribe(value => {
      this.subtotalPieceSets(list, form);
    })
  },

  subtotalPieceSets(list: FormArray, form: FormGroup){
    setTimeout(() => {
      let total = 
      list.value.reduce(
        (a, b) => {
          return  a + b.total
        },0
      );
      form.patchValue({
        list_pieces_sets_subtotal: total
      }) 
    }, 100);
  }
};