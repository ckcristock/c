import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioDotacionComponent } from './inventario-dotacion.component';

describe('InventarioDotacionComponent', () => {
  let component: InventarioDotacionComponent;
  let fixture: ComponentFixture<InventarioDotacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventarioDotacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioDotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
