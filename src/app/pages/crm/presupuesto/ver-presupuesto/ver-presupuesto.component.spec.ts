import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPresupuestoComponent } from './ver-presupuesto.component';

describe('VerPresupuestoComponent', () => {
  let component: VerPresupuestoComponent;
  let fixture: ComponentFixture<VerPresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPresupuestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
