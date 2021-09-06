import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposAnulacionComponent } from './tipos-anulacion.component';

describe('TiposAnulacionComponent', () => {
  let component: TiposAnulacionComponent;
  let fixture: ComponentFixture<TiposAnulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposAnulacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
