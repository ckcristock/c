import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleLlegadaComponent } from './detalle-llegada.component';

describe('DetalleLlegadaComponent', () => {
  let component: DetalleLlegadaComponent;
  let fixture: ComponentFixture<DetalleLlegadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleLlegadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleLlegadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
