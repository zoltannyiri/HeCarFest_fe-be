import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KezdolapComponent } from './kezdolap/kezdolap.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'hecarfest-voting';
}
