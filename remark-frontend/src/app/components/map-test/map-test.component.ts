import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-map-test',
  template: `<div id="map" style="height: 100vh; width: 100%;"></div>`,
})
export class MapTestComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 26.9124, lng: 75.7873 },
      zoom: 14
    });

    new google.maps.Marker({
      position: { lat: 26.9124, lng: 75.7873 },
      map,
      title: "Test Marker"
    });
  }
}
