import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  userRole: string = 'rider'; // or 'driver' - could be selected via dropdown in form

  constructor(private router: Router) {}

  onLogin() {
    // Simple role-based navigation (replace with actual auth logic)
    if (this.userRole === 'driver') {
      this.router.navigate(['/driver-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
