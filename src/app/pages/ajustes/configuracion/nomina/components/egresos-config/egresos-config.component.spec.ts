import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresosConfigComponent } from './egresos-config.component';

describe('EgresosConfigComponent', () => {
  let component: EgresosConfigComponent;
  let fixture: ComponentFixture<EgresosConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EgresosConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresosConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
