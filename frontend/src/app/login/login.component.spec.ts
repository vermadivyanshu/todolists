import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule }  from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Router, {
        provider: AuthenticationService,
        useValue: jasmine.createSpyObj('AuthenticationService', ['signIn'])
      }],
      imports: [HttpClientTestingModule, NoopAnimationsModule, LoginComponent, RouterTestingModule]
    })
    .compileComponents();

    TestBed.inject(AuthenticationService);
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have input elements', () => {
    const inputElements = fixture.debugElement.queryAll(By.css('input'));
    expect(inputElements.length).toEqual(2);
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toEqual(1);
  });

  it('should have login button disabled', () => {
    const [btn] = fixture.debugElement.queryAll(By.css('button'));
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should have login button enabled when both input are present', () => {
    component.loginForm.setValue({username: 'test', password: 'test'});
    const [btn] = fixture.debugElement.queryAll(By.css('button'));
    fixture.detectChanges();
    expect(btn.nativeElement.disabled).toBeFalse();
  });

  it('should have login button disabled when username input is present', () => {
    component.loginForm.setValue({username: 'test', password: null});
    const [btn] = fixture.debugElement.queryAll(By.css('button'));
    fixture.detectChanges();
    expect(btn.nativeElement.disabled).toBeTrue();
  });

  it('should call onSubmit when login button is clicked', async() => {
    spyOn(component, 'onSubmit');
    component.loginForm.setValue({username: 'test', password: 'test'});
    fixture.detectChanges();
    const btn = fixture.debugElement.nativeElement.querySelector('button');
    btn.click();
    await fixture.whenStable();
    expect(component.onSubmit).toHaveBeenCalled();
  })

  it('should have login button disabled when password input is present', () => {
    component.loginForm.setValue({username: null, password: 'pass'});
    const [btn] = fixture.debugElement.queryAll(By.css('button'));
    fixture.detectChanges();
    expect(btn.nativeElement.disabled).toBeTrue();
  });
});
