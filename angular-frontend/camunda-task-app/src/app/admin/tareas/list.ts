import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TareaService } from './tarea.service';
import { Tarea } from './tarea.model';

@Component({
  selector: 'admin-tareas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class list implements OnInit {
  tareas: Tarea[] = [];
  loading = true;
  error: string | null = null;

  constructor(private tareaService: TareaService) {}

  ngOnInit() {
    this.tareaService.getTareas().subscribe({
      next: (data) => {
        this.tareas = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las tareas';
        this.loading = false;
      }
    });
  }
}
