import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposEstadoFinancieroComponent } from './tipos-estado-financiero.component';

describe('TiposEstadoFinancieroComponent', () => {
  let component: TiposEstadoFinancieroComponent;
  let fixture: ComponentFixture<TiposEstadoFinancieroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposEstadoFinancieroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposEstadoFinancieroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
