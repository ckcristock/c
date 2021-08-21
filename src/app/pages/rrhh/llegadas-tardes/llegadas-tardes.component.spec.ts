import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlegadasTardesComponent } from './llegadas-tardes.component';

describe('LlegadasTardesComponent', () => {
  let component: LlegadasTardesComponent;
  let fixture: ComponentFixture<LlegadasTardesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LlegadasTardesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LlegadasTardesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
