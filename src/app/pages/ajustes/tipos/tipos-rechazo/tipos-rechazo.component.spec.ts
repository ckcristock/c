import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposRechazoComponent } from './tipos-rechazo.component';

describe('TiposRechazoComponent', () => {
  let component: TiposRechazoComponent;
  let fixture: ComponentFixture<TiposRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposRechazoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
