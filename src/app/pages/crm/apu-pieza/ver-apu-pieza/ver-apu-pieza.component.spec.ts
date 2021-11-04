import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerApuPiezaComponent } from './ver-apu-pieza.component';

describe('VerApuPiezaComponent', () => {
  let component: VerApuPiezaComponent;
  let fixture: ComponentFixture<VerApuPiezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerApuPiezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerApuPiezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
