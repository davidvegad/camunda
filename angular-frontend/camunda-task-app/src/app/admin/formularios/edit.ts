import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioService } from './formulario.service';
import { Formulario } from './formulario.model';
// Importa el componente de campos en formulario:
import {camposFormularioList } from '../campos-formulario/list';
//import {tareasFormularioList } from '../tareas-formulario/list';


@Component({
  selector: 'admin-formularios-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, camposFormularioList],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class edit implements OnInit {
  form!: FormGroup;
  isEdit = false;
  formularioId?: number;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formularioService: FormularioService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEdit = true;
        this.formularioId = +idParam;
        this.formularioService.getFormulario(this.formularioId).subscribe({
          next: data => this.form.patchValue(data),
          error: () => this.error = 'No se pudo cargar el formulario'
        });
      } else {
        this.isEdit = false;
        this.formularioId = undefined;
        this.form.reset();
      }
    });
  }

  onSubmit() {
    this.error = null;
    this.success = null;
    const datos: Formulario = {
      nombre: this.form.value['nombre'] || '',
      descripcion: this.form.value['descripcion'] || ''
    };
    if (this.isEdit && this.formularioId) {
      this.formularioService.updateFormulario(this.formularioId, datos).subscribe({
        next: () => {
          this.success = 'Formulario actualizado correctamente';
          setTimeout(() => this.volver(), 1200);
        },
        error: () => this.error = 'No se pudo actualizar'
      });
    } else {
      this.formularioService.createFormulario(datos).subscribe({
        next: (f) => {
          this.success = 'Formulario creado correctamente';
          setTimeout(() => {
            this.router.navigate(['/admin/formularios', f.id]);
          }, 1200);
        },
        error: () => this.error = 'No se pudo crear'
      });
    }
  }

  volver() {
    this.router.navigate(['/admin/formularios']);
  }
}
