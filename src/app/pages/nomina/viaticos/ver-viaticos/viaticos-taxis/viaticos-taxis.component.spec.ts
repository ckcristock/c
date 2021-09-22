import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaticosTaxisComponent } from './viaticos-taxis.component';

describe('ViaticosTaxisComponent', () => {
  let component: ViaticosTaxisComponent;
  let fixture: ComponentFixture<ViaticosTaxisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaticosTaxisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaticosTaxisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
