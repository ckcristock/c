import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaticosAlimentacionComponent } from './viaticos-alimentacion.component';

describe('ViaticosAlimentacionComponent', () => {
  let component: ViaticosAlimentacionComponent;
  let fixture: ComponentFixture<ViaticosAlimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaticosAlimentacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaticosAlimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
