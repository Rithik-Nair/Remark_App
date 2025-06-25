import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-live-tracking',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  template: `
    <google-map 
      height="400px" 
      width="100%" 
      [center]="center" 
      [zoom]="15">
      <map-marker [position]="center" [label]="'📍 You'"></map-marker>
    </google-map>
  `
})
export class LiveTrackingComponent {
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  constructor() {
    this.trackLocation();
  }

  trackLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    } else {
      alert('Geolocation not supported.');
    }
  }
}
