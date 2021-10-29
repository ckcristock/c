import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuPiezaComponent } from './apu-pieza.component';

describe('ApuPiezaComponent', () => {
  let component: ApuPiezaComponent;
  let fixture: ComponentFixture<ApuPiezaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApuPiezaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuPiezaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
