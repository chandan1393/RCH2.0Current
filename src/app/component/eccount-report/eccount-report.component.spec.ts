import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECCountReportComponent } from './eccount-report.component';

describe('ECCountReportComponent', () => {
  let component: ECCountReportComponent;
  let fixture: ComponentFixture<ECCountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ECCountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ECCountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
