import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParafiscalesConfigComponent } from './parafiscales-config.component';

describe('ParafiscalesConfigComponent', () => {
  let component: ParafiscalesConfigComponent;
  let fixture: ComponentFixture<ParafiscalesConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParafiscalesConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParafiscalesConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
