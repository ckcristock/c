import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerApuConjuntoComponent } from './ver-apu-conjunto.component';

describe('VerApuConjuntoComponent', () => {
  let component: VerApuConjuntoComponent;
  let fixture: ComponentFixture<VerApuConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerApuConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerApuConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
