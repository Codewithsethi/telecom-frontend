import { Component, signal } from '@angular/core';
import { Recharge } from './recharge/recharge';

@Component({
  selector: 'app-root',
  imports: [Recharge],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('telecom-frontend');
}
