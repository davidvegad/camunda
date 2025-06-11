import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampoService } from './campo.service';
import { Campo } from './campo.model';

@Component({
  selector: 'admin-campos-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class edit implements OnInit {
  form!: FormGroup;
  isEdit = false;
  campoId?: number;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private campoService: CampoService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombreCampo: ['', Validators.required],
      etiqueta: ['', Validators.required],
      tipo: ['', Validators.required],
      placeholder: [''],
      opciones: [''],
      validacionRegex: [''],
      mensajeError: ['']
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.campoId = +idParam;
        this.campoService.getCampo(this.campoId).subscribe({
          next: data => this.form.patchValue(data),
          error: () => this.error = 'No se pudo cargar el campo'
        });
      } else {
        this.isEdit = false;
        this.campoId = undefined;
        this.form.reset();
      }
    });
  }

  onSubmit() {
    this.error = null;
    this.success = null;
    const datos: Campo = {
      nombreCampo: this.form.value['nombreCampo'] || '',
      etiqueta: this.form.value['etiqueta'] || '',
      tipo: this.form.value['tipo'] || '',
      placeholder: this.form.value['placeholder'] || '',
      opciones: this.form.value['opciones'] || '',
      validacionRegex: this.form.value['validacionRegex'] || '',
      mensajeError: this.form.value['mensajeError'] || ''
    };
    if (this.isEdit && this.campoId) {
      this.campoService.updateCampo(this.campoId, datos).subscribe({
        next: () => {
          this.success = 'Campo actualizado correctamente';
          setTimeout(() => this.volver(), 1200);
        },
        error: () => this.error = 'No se pudo actualizar'
      });
    } else {
      this.campoService.createCampo(datos).subscribe({
        next: () => {
          this.success = 'Campo creado correctamente';
          setTimeout(() => this.volver(), 1200);
        },
        error: () => this.error = 'No se pudo crear'
      });
    }
  }

  volver() {
    this.router.navigate(['/admin/campos']);
  }
}
