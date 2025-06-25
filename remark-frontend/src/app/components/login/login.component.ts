import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  userRole: string = 'rider';

  constructor(private router: Router, private authService: AuthService) {}

  onLogin() {
    this.authService.loginUser(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        if (res.success) {
          alert('Login successful!');
          this.router.navigate([this.userRole === 'driver' ? '/driver-dashboard' : '/user-dashboard']);
        } else {
          alert('Login failed!');
        }
      },
      error: (err: any) => {
        console.error('Login error:', err);
        alert(err.error?.message || 'Invalid email or password ❌');
      }
    });
  }
}
