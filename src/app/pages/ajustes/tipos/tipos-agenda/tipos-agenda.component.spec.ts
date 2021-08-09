import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposAgendaComponent } from './tipos-agenda.component';

describe('TiposAgendaComponent', () => {
  let component: TiposAgendaComponent;
  let fixture: ComponentFixture<TiposAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
