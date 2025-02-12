import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EredmenyComponent } from './eredmeny.component';

describe('EredmenyComponent', () => {
  let component: EredmenyComponent;
  let fixture: ComponentFixture<EredmenyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EredmenyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EredmenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
