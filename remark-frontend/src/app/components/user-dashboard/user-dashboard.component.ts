import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  pickup: string = '';
  destination: string = '';
  menuOpen: boolean = false;
  showMapOnly: boolean = false;
  showMap: boolean = false;

  map!: L.Map;
  userMarker!: L.Marker;
  driverMarker!: L.Marker;
  driverInterval: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Optionally, you could get location on load
    // this.getCurrentLocation();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      this.pickup = `${lat}, ${lng}`;
    } catch (error) {
      console.error('Location error:', error);
      alert('Enable location permission in app settings.');
    }
  }

  bookRide(): void {
    if (!this.pickup || !this.destination) {
      alert('Please enter pickup and destination');
      return;
    }

    this.showMap = true;
    setTimeout(() => this.initMap(), 0);

    alert('Driver Assigned 🚗');

    const pickupCoords = this.getPickupLatLng();
    this.simulateDriverToPickup(pickupCoords);

    setTimeout(() => {
      this.verifyOTP(pickupCoords);
    }, 3000);
  }

  initMap(): void {
    this.map = L.map('map').setView([26.9124, 75.7873], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
  }

  getPickupLatLng(): L.LatLng {
    const [lat, lng] = this.pickup.split(',').map(parseFloat);
    return L.latLng(lat, lng);
  }

  getDestinationLatLng(): L.LatLng {
    const [lat, lng] = this.destination.split(',').map(parseFloat);
    return L.latLng(lat, lng);
  }

  simulateDriverToPickup(pickup: L.LatLng) {
    let driverLat = pickup.lat - 0.005;
    let driverLng = pickup.lng - 0.005;

    this.driverMarker = L.marker([driverLat, driverLng], {
      icon: this.getDriverIcon()
    }).addTo(this.map).bindPopup('Driver on the way').openPopup();

    this.userMarker = L.marker([pickup.lat, pickup.lng])
      .addTo(this.map).bindPopup('Pickup Point').openPopup();

    const interval = setInterval(() => {
      driverLat += 0.0005;
      driverLng += 0.0005;
      this.driverMarker.setLatLng([driverLat, driverLng]);

      if (Math.abs(driverLat - pickup.lat) < 0.0005 && Math.abs(driverLng - pickup.lng) < 0.0005) {
        clearInterval(interval);
      }
    }, 1000);
  }

  verifyOTP(pickupLatLng: L.LatLng) {
    const enteredOtp = prompt('Enter OTP sent to your phone:');

    if (enteredOtp === '1234') {
      alert('OTP Verified ✅');
      this.showMapOnly = true;

      setTimeout(() => {
        this.showRideSummary();

        const destLatLng = this.getDestinationLatLng();
        this.showRouteToDestination(pickupLatLng, destLatLng);
      }, 100);
    } else {
      alert('Invalid OTP ❌');
    }
  }

  showRouteToDestination(pickup: L.LatLng, drop: L.LatLng) {
    this.map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        this.map.removeLayer(layer);
      }
    });

    this.userMarker = L.marker(pickup).addTo(this.map).bindPopup('Pickup').openPopup();
    L.marker(drop).addTo(this.map).bindPopup('Drop').openPopup();

    const path: L.LatLngTuple[] = [[pickup.lat, pickup.lng], [drop.lat, drop.lng]];
    L.polyline(path, { color: 'blue' }).addTo(this.map);
    this.map.fitBounds(L.latLngBounds(path));

    this.simulateDriverToDrop(drop);
  }

  simulateDriverToDrop(dest: L.LatLng) {
    let lat = this.userMarker.getLatLng().lat;
    let lng = this.userMarker.getLatLng().lng;

    const interval = setInterval(() => {
      lat += 0.0004;
      lng += 0.0004;
      this.driverMarker.setLatLng([lat, lng]);

      if (Math.abs(lat - dest.lat) < 0.0005 && Math.abs(lng - dest.lng) < 0.0005) {
        clearInterval(interval);
        alert('Ride Completed 🎉');
        this.saveRideHistory(this.userMarker.getLatLng(), dest);
      }
    }, 1000);
  }

  getDriverIcon() {
    return L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854894.png',
      iconSize: [30, 30]
    });
  }

  saveRideHistory(pickup: L.LatLng, drop: L.LatLng) {
    const ride = {
      pickup: pickup.toString(),
      drop: drop.toString(),
      time: new Date().toLocaleString(),
      fare: 60
    };

    const history = JSON.parse(localStorage.getItem('rideHistory') || '[]');
    history.push(ride);
    localStorage.setItem('rideHistory', JSON.stringify(history));

    this.router.navigate(['/history']);
  }

  showRideSummary() {
    const fare = 60;
    const eta = 8;
    const rideType = "EV Bike";
    alert(`✅ Ride Confirmed!\n\n 🚴‍♀️ Ride Type: ${rideType}\n🕒 ETA: ${eta} mins\n💰 Fare: ₹${fare}\n\nTrack your driver on the map.`);
  }
}
