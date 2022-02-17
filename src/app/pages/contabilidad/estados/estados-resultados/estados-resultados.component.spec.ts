import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosResultadosComponent } from './estados-resultados.component';

describe('EstadosResultadosComponent', () => {
  let component: EstadosResultadosComponent;
  let fixture: ComponentFixture<EstadosResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadosResultadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
