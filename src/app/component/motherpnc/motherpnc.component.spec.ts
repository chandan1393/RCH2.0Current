import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherpncComponent } from './motherpnc.component';

describe('MotherpncComponent', () => {
  let component: MotherpncComponent;
  let fixture: ComponentFixture<MotherpncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherpncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherpncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
