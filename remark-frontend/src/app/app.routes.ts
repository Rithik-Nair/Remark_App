// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DriverDashboardComponent } from './components/driver-dashboard/driver-dashboard.component';
import { BookRideComponent } from './components/book-ride/book-ride.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { MapTestComponent } from './components/map-test/map-test.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'driver-dashboard', component: DriverDashboardComponent },
  { path: 'book-ride', component: BookRideComponent },
  { path: 'user-dashboard', component: UserDashboardComponent },
  { path: 'history', loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent)},
  { path: 'live-tracking', loadComponent: () => import('./components/live-tracking/live-tracking.component').then(m => m.LiveTrackingComponent)},
  {
  path: 'live-tracking',
  loadComponent: () =>
    import('./components/live-tracking/live-tracking.component').then(
      m => m.LiveTrackingComponent
    )
  },
  {
  path: 'map-test',
  component: MapTestComponent
  }
];
