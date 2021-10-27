import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesMedidasComponent } from './unidades-medidas.component';

describe('UnidadesMedidasComponent', () => {
  let component: UnidadesMedidasComponent;
  let fixture: ComponentFixture<UnidadesMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnidadesMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
