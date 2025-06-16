/*import { Component, OnInit } from '@angular/core';
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
}*/
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampoService } from './campo.service';
import { Campo } from './campo.model';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'admin-campos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css'],
  animations: [
    trigger('rowAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(25px)' }),
        animate('420ms cubic-bezier(.35,2,.7,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('280ms cubic-bezier(.55,.01,.6,.8)', style({ opacity: 0, transform: 'translateY(-18px)' }))
      ])
    ]),
    trigger('tableAnimation', [
      transition('* => *', [
        query('tr', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(60, [
            animate('280ms cubic-bezier(.35,2,.7,1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
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

  // Para trackBy en ngFor (mejor performance y animación precisa)
  trackById(index: number, campo: Campo): number | undefined {
    return campo.id;
  }
}

