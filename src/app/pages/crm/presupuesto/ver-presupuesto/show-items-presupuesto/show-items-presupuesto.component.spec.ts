import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowItemsPresupuestoComponent } from './show-items-presupuesto.component';

describe('ShowItemsPresupuestoComponent', () => {
  let component: ShowItemsPresupuestoComponent;
  let fixture: ComponentFixture<ShowItemsPresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowItemsPresupuestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowItemsPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
