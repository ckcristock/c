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
          apu_part_id: [r.apu_part_id],
          apu_set_child_id: [r.apu_set_child_id],
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
      apu_part_id: [0],
      apu_set_child_id: [0],
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
    group.get('apu_type').valueChanges.subscribe(value => {
      (value == 'conjunto'
      ?
      group.patchValue({
        apu_part_id: 0,
        unit: '',
        amount: 0,
        unit_cost: 0,
        total: 0
      }) 
      :
      group.patchValue({
        apu_set_child_id: 0,
        unit: '',
        amount: 0,
        unit_cost: 0,
        total: 0
      }))
    })
    group.get('apu_part_id').valueChanges.subscribe(value => {
      if (group.get('apu_type').value == 'pieza') {
        let data = apuParts.find(a => a.id == value);
        group.patchValue({
          unit_cost: data.unit_direct_cost
        });
      }
    });
    group.get('apu_set_child_id').valueChanges.subscribe(value => {
      if (group.get('apu_type').value == 'conjunto') {
        let data = apuSets.find(a => a.id == value);
        group.patchValue({
          unit_cost: data.total_direct_cost
        });
      }
    });
    group.get('amount').valueChanges.subscribe(value => {
      let unit_cost = group.get('unit_cost').value;
      let result = unit_cost * value;
      group.patchValue({
        total: Math.round(result)
      })
    });
    group.get('unit_cost').valueChanges.subscribe(value => {
      let amount = group.get('amount').value;
      let result = value * amount; 
      group.patchValue({
        total: Math.round(result)
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