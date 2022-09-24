import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import Swal from 'sweetalert2';
import { IRules } from '../core/interfaces/wumpus.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Wumpus World';
}
