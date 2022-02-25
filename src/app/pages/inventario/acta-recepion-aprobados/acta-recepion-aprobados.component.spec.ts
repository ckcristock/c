import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActaRecepionAprobadosComponent } from './acta-recepion-aprobados.component';

describe('ActaRecepionAprobadosComponent', () => {
  let component: ActaRecepionAprobadosComponent;
  let fixture: ComponentFixture<ActaRecepionAprobadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActaRecepionAprobadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActaRecepionAprobadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
