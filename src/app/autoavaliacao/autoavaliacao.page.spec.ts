import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AutoavaliacaoPage } from './autoavaliacao.page';

describe('AutoavaliacaoPage', () => {
  let component: AutoavaliacaoPage;
  let fixture: ComponentFixture<AutoavaliacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoavaliacaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AutoavaliacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
