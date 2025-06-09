import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],    // <-- ¡AQUÍ!
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {}
