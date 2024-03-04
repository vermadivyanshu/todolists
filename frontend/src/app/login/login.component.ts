import { Component, OnInit, Optional } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button'; 
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(1)])
    });
  }

  ngOnInit(): void {
    this.loginForm.get('username')?.valueChanges.subscribe(value => {
      this.loginForm.get('username')?.patchValue(value?.trim(), { emitEvent: false });
    });

  }

  onSubmit() {
    if(!this.loginForm || this.loginForm.invalid) {
      return;
    }
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password)
    .subscribe(() => {
      this.router.navigate(['home'])
    });
  }
}
