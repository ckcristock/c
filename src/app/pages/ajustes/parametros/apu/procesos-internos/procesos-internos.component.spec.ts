import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesosInternosComponent } from './procesos-internos.component';

describe('ProcesosInternosComponent', () => {
  let component: ProcesosInternosComponent;
  let fixture: ComponentFixture<ProcesosInternosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesosInternosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesosInternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
