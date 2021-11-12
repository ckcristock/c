import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorteAguaComponent } from './corte-agua.component';

describe('CorteAguaComponent', () => {
  let component: CorteAguaComponent;
  let fixture: ComponentFixture<CorteAguaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorteAguaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorteAguaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
