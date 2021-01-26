import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndUiComponent } from './end-ui.component';

describe('EndUiComponent', () => {
  let component: EndUiComponent;
  let fixture: ComponentFixture<EndUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
