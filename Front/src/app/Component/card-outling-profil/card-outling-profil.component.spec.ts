import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardOutlingProfilComponent } from './card-outling-profil.component';

describe('CardOutlingProfilComponent', () => {
  let component: CardOutlingProfilComponent;
  let fixture: ComponentFixture<CardOutlingProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardOutlingProfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardOutlingProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
