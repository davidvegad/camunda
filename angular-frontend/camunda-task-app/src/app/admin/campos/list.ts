import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampoService } from './campo.service';
import { Campo } from './campo.model';

@Component({
  selector: 'admin-campos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class list implements OnInit {
  campos: Campo[] = [];
  error: string | null = null;
  loading = true;

  constructor(private campoService: CampoService) {}

  ngOnInit() {
    this.campoService.getCampos().subscribe({
      next: (data) => {
        this.campos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los campos';
        this.loading = false;
      }
    });
  }
}
