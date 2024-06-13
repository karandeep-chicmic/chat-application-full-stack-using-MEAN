import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { user } from '../../../Interfaces/user.interface';
import { ApiCallsService } from '../../../Services/api-calls.service';
import { Router, RouterModule } from '@angular/router';
import { ROUTES_UI } from '../../../constants';
import { SweetAlertService } from '../../../Services/sweet-alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router: Router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid !!');
      return;
    }

    const userToLogin: user = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

    this.apiCalls.loginUser(userToLogin).subscribe({
      next: (data: any) => {
        console.log(data);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        this.router.navigate([ROUTES_UI.CHAT]);
      },
      error: (err) => {
        console.log('ERROR IS :', err);
      },
    });
  }
}
