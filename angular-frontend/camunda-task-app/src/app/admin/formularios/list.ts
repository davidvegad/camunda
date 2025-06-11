import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormularioService } from './formulario.service';
import { Formulario } from './formulario.model';

@Component({
  selector: 'admin-formularios-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class list implements OnInit {
  formularios: Formulario[] = [];
  loading = true;
  error: string | null = null;

  constructor(private formularioService: FormularioService) {}

  ngOnInit() {
    this.formularioService.getFormularios().subscribe({
      next: (data) => {
        this.formularios = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los formularios';
        this.loading = false;
      }
    });
  }
}
