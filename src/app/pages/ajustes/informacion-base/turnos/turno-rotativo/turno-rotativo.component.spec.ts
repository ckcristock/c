import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoRotativoComponent } from './turno-rotativo.component';

describe('TurnoRotativoComponent', () => {
  let component: TurnoRotativoComponent;
  let fixture: ComponentFixture<TurnoRotativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnoRotativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoRotativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
