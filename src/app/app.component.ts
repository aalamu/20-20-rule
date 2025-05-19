import {Component} from '@angular/core';
import {Timer} from './timer';

@Component({
  selector: 'app-root',
  imports: [Timer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'twenty-twenty-rule';
}
