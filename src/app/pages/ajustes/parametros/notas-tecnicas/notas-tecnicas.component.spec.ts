import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasTecnicasComponent } from './notas-tecnicas.component';

describe('NotasTecnicasComponent', () => {
  let component: NotasTecnicasComponent;
  let fixture: ComponentFixture<NotasTecnicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasTecnicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasTecnicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
