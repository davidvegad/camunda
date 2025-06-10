import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'formulario-dinamico',
  templateUrl: './formulario-dinamico.html',
  styleUrls: ['./formulario-dinamico.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class FormularioDinamicoComponent implements OnChanges {
  @Input() campos: any[] = [];
  @Input() valoresIniciales: any = {};
  @Output() formularioValido = new EventEmitter<FormGroup>();

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnChanges() {
    this.crearFormulario();
  }

  crearFormulario() {
    const group: any = {};
    for (const campo of this.campos) {
      const validadores: ValidatorFn[] = [];
      if (campo.requerido) validadores.push(Validators.required);
      if (campo.validacionRegex)
        validadores.push(Validators.pattern(campo.validacionRegex));
      group[campo.nombreCampo] = [
        this.valoresIniciales[campo.nombreCampo] ?? campo.valorPorDefecto ?? '',
        validadores,
      ];
    }
    this.formulario = this.fb.group(group);
    this.formulario.valueChanges.subscribe(val => {
      this.formularioValido.emit(this.formulario);
    });
  }

  getError(campo: any): string | null {
    const control = this.formulario.get(campo.nombreCampo);
    if (!control || control.pristine) return null;
    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('pattern')) return campo.mensajeError || 'Valor inválido';
    return null;
  }
}
