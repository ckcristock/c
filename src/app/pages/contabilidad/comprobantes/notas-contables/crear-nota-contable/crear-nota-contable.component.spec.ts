import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNotaContableComponent } from './crear-nota-contable.component';

describe('CrearNotaContableComponent', () => {
  let component: CrearNotaContableComponent;
  let fixture: ComponentFixture<CrearNotaContableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNotaContableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNotaContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
