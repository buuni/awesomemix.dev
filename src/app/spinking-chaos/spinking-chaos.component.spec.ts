import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinkingChaosComponent } from './spinking-chaos.component';

describe('SpinkingChaosComponent', () => {
  let component: SpinkingChaosComponent;
  let fixture: ComponentFixture<SpinkingChaosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinkingChaosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinkingChaosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
