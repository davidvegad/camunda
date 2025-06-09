import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcesoInicioComponent } from '../proceso-inicio/proceso-inicio';
import { BandejaTareasComponent } from '../bandeja-tareas/bandeja-tareas';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProcesoInicioComponent, BandejaTareasComponent],
  template: `
    <div class="home-layout">
      <div class="panel panel-inicio">
        <app-proceso-inicio></app-proceso-inicio>
      </div>
      <div class="panel panel-bandeja">
        <app-bandeja-tareas></app-bandeja-tareas>
      </div>
    </div>
  `,
  styles: [`
    .home-layout { display: flex; flex-direction: column; gap: 2rem; padding: 2rem; }
    .panel { background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 1.5rem; }
    @media (min-width: 900px) {
      .home-layout { flex-direction: row; }
      .panel { flex: 1 1 0; }
      .panel-inicio { margin-right: 2rem; }
    }
  `]
})
export class HomeComponent {}
