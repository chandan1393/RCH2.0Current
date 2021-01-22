import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherancComponent } from './motheranc.component';

describe('MotherancComponent', () => {
  let component: MotherancComponent;
  let fixture: ComponentFixture<MotherancComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherancComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherancComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
