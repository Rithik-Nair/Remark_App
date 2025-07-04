import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  rides: any[] = [];

  ngOnInit() {
    const history = localStorage.getItem('rideHistory');
    if (history) {
      this.rides = JSON.parse(history);
    }
  }
}
