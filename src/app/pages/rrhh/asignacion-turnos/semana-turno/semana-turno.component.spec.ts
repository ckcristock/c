import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanaTurnoComponent } from './semana-turno.component';

describe('SemanaTurnoComponent', () => {
  let component: SemanaTurnoComponent;
  let fixture: ComponentFixture<SemanaTurnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemanaTurnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanaTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
