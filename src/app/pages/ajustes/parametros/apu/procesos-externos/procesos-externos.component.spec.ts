import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosExternosComponent } from './procesos-externos.component';

describe('ProcesosExternosComponent', () => {
  let component: ProcesosExternosComponent;
  let fixture: ComponentFixture<ProcesosExternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosExternosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
