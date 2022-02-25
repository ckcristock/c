import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioEstibasComponent } from './inventario-estibas.component';

describe('InventarioEstibasComponent', () => {
  let component: InventarioEstibasComponent;
  let fixture: ComponentFixture<InventarioEstibasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioEstibasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioEstibasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
