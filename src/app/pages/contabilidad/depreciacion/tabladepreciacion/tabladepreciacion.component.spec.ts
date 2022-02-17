import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabladepreciacionComponent } from './tabladepreciacion.component';

describe('TabladepreciacionComponent', () => {
  let component: TabladepreciacionComponent;
  let fixture: ComponentFixture<TabladepreciacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabladepreciacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabladepreciacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
