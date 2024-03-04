import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TodoService } from '../services/todo.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;


  beforeEach(async () => {
    todoServiceSpy = jasmine.createSpyObj('TodoService', ['getAllList'])
    await TestBed.configureTestingModule({
      providers: [{
        provider: TodoService,
        useValue: todoServiceSpy
      }],
      imports: [HomeComponent, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should contain heading Lists', () => {
    const [heading] = fixture.debugElement.queryAll(By.css('.heading'));
    expect(heading.nativeElement.textContent).toEqual('Lists');
  })

  it('should contain New List button', () => {
    const [btn] = fixture.debugElement.queryAll(By.css('button'));
    expect(btn.nativeElement.textContent).toEqual('New List');
  });

  it('should have created list name as item', () => {
    component.lists = [{
      id: 1, name: 'list'
    }];
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('.home-list-item-btn'));
    console.log(buttons);
    expect(buttons[0].nativeElement.textContent.trim()).toContain('checklistlist')
  });
});
