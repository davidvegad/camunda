import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'formulario-dinamico',
	templateUrl: './formulario-dinamico.html',
	styleUrls: ['./formulario-dinamico.css'],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule]
})
export class FormularioDinamicoComponent implements OnInit, OnChanges {
	@Input() campos: any[] = [];
	@Input() valoresIniciales: any = {};
	@Input() titulo: string = '';
	@Input() formularioId: number | string = '';
	formulario!: FormGroup;
	archivos: { [campo: string]: File | null } = {};
	
	constructor(private fb: FormBuilder) {}
	
	ngOnInit() {
		this.crearFormulario();
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['campos'] || changes['valoresIniciales']) {
			this.crearFormulario();
		}
	}
	
	crearFormulario() {
		const grupo: { [key: string]: any } = {};
		for (const campo of this.campos) {
			let val = this.valoresIniciales?.[campo.nombreCampo] ?? campo.valorPorDefecto ?? '';
			let validators = [];
			if (campo.requerido) validators.push(Validators.required);
			if (campo.validacionRegex) validators.push(Validators.pattern(campo.validacionRegex));
			grupo[campo.nombreCampo] = new FormControl(val, validators);
		}
		this.formulario = this.fb.group(grupo);
	}
	
	camposPorColumna(col: number) {
		return this.campos.filter((_, idx) => idx % 2 === col);
	}
	
	opcionesCampo(campo: any): any[] {
		if (!campo.opciones) return [];
		if (Array.isArray(campo.opciones)) {
			return campo.opciones.map((o: any) =>
				typeof o === 'string' ? { label: o, value: o } : o
			);
		}
		return campo.opciones.split(',').map((o: string) => {
			const [label, value] = o.includes(':') ? o.split(':') : [o.trim(), o.trim()];
			return { label: label.trim(), value: (value ?? label).trim() };
		});
	}
	
	getError(campo: any): string | null {
		const control = this.formulario?.get(campo.nombreCampo);
		if (!control || !control.touched && !control.dirty) return null;
		if (control.hasError('required')) return campo.mensajeError || 'Campo obligatorio';
		if (control.hasError('pattern')) return campo.mensajeError || 'Formato inválido';
		return null;
	}
	
	onFileChange(event: Event, campoNombre: string) {
		const input = event.target as HTMLInputElement;
		if (input.files?.length) {
			this.archivos[campoNombre] = input.files[0];
		}
	}
}
