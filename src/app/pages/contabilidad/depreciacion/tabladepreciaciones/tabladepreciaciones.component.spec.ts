import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladepreciacionesComponent } from './tabladepreciaciones.component';

describe('TabladepreciacionesComponent', () => {
  let component: TabladepreciacionesComponent;
  let fixture: ComponentFixture<TabladepreciacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabladepreciacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabladepreciacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
