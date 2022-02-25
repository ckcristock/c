import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioEstibaComponent } from './inventario-estiba.component';

describe('InventarioEstibaComponent', () => {
  let component: InventarioEstibaComponent;
  let fixture: ComponentFixture<InventarioEstibaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioEstibaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioEstibaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
