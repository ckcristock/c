import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemorandosComponent } from './memorandos.component';

describe('MemorandosComponent', () => {
  let component: MemorandosComponent;
  let fixture: ComponentFixture<MemorandosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemorandosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemorandosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
