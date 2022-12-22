import {
  FormGroup,
  FormBuilder,
  FormArray
} from '@angular/forms';

export const piecesSetsHelper = {

  createFillInPiecesSets(form: FormGroup, fb: FormBuilder, data) {
    if (data.setpartlist) {
      let list_pieces_sets = form.get('list_pieces_sets') as FormArray;
      data.setpartlist.forEach((r) => {
        let group = fb.group({
          apu_type: [r.apu_type],
          apu_part_id: [r.apu_part_id],
          apu_set_child_id: [r.apu_set_child_id],
          unit_id: [r.unit_id],
          amount: [r.amount],
          unit_cost: [r.unit_cost],
          total: [r.total],
          description: []
        });
        this.subscribePiecesSets(group, form, list_pieces_sets);
        list_pieces_sets.push(group);
      });
    }
  },

  createPiecesSetsGroup(form: FormGroup, fb: FormBuilder, item) {
    let setpartlist = fb.group({
      apu_type: (item ? item.type : 'P'),
      apu_part_id: (item ? item.apu_id : 0),
      apu_set_child_id: (item ? item.apu_id : 0),
      unit_id: [''],
      amount: [0],
      unit_cost: (item ? item.unit_cost : 0),
      total: [0],
      description: (item ? item.name : '')
    });
    let list = form.get('list_pieces_sets') as FormArray;
    this.subscribePiecesSets(setpartlist, form, list);
    return setpartlist;
  },

  subscribePiecesSets( group: FormGroup, form:FormGroup, list: FormArray){
    group.get('apu_type').valueChanges.subscribe(value => {
      (value == 'C'
      ?
      group.patchValue({
        description: '',
        apu_part_id: '',
        unit: '',
        amount: 0,
        unit_cost: 0,
        total: 0
      })
      :
      group.patchValue({
        description: '',
        apu_set_child_id: '',
        unit: '',
        amount: 0,
        unit_cost: 0,
        total: 0
      }))
    })
    group.get('description').valueChanges.subscribe(value => {
      if (group.get('apu_type').value == 'P') {
        group.patchValue({
          unit_cost: value.unit_direct_cost
        });
      } else if (group.get('apu_type').value == 'C') {
        group.patchValue({
          unit_cost: value.total_direct_cost
        });
      }
    });
    group.get('amount').valueChanges.subscribe(value => {
      let unit_cost = group.get('unit_cost');
      let result = (typeof value == 'number' && typeof unit_cost.value == 'number' ? (unit_cost.value * value) : 0);
      group.patchValue({
        total: Math.round(result)
      })
    });
    group.get('unit_cost').valueChanges.subscribe(value => {
      let amount = group.get('amount');
      let result = (typeof value == 'number' && typeof amount.value == 'number' ? (value * amount.value) : 0);
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
