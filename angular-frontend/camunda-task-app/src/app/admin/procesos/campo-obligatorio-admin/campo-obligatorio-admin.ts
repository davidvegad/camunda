import { Component, Input, OnInit } from '@angular/core';
import { CampoObligatorioService } from './campo-obligatorio.service';
import { CampoObligatorio } from './campo-obligatorio.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-campo-obligatorio-admin',
	standalone: true,
	imports: [FormsModule,CommonModule],  // <-- AGREGA ESTO
	templateUrl: './campo-obligatorio-admin.html',
	styleUrls: ['./campo-obligatorio-admin.css']
})
export class CampoObligatorioAdmin implements OnInit {
	@Input() procesoId!: number;
	campos: CampoObligatorio[] = [];
	campoActual: CampoObligatorio = this.nuevoCampo();
	editando = false;
	
	constructor(private campoService: CampoObligatorioService,
		@Inject(MAT_DIALOG_DATA) public data: { procesoId: number },
		public dialogRef: MatDialogRef<CampoObligatorioAdmin>) 
	{
		this.procesoId = data.procesoId;
	}
	//procesoId!: number;
	
	ngOnInit() {
		if (this.procesoId) {
			this.cargarCampos();
		}
	}
	
	ngOnChanges() {
		this.cargarCampos();
	}
	
	cargarCampos() {
		if (!this.procesoId) return;
		this.campoService.getByProcesoId(this.procesoId)
		.subscribe(campos => this.campos = campos);
	}
	
	guardarCampo() {
		if (this.editando && this.campoActual.id) {
			this.campoService.update(this.campoActual.id, this.campoActual)
			.subscribe(() => {
				this.cargarCampos();
				this.cancelar();
			});
			} else {
			this.campoActual.procesoId = this.procesoId;
			this.campoService.create(this.campoActual)
			.subscribe(() => {
				this.cargarCampos();
				this.cancelar();
			});
		}
	}
	
	editarCampo(campo: CampoObligatorio) {
		this.campoActual = { ...campo };
		this.editando = true;
	}
	
	eliminarCampo(campo: CampoObligatorio) {
		if (campo.id) {
			this.campoService.delete(campo.id).subscribe(() => this.cargarCampos());
		}
	}
	
	cancelar() {
		this.campoActual = this.nuevoCampo();
		this.editando = false;
	}
	
	nuevoCampo(): CampoObligatorio {
		return {
			esDocumento: false,
			etiqueta: '',
			nombre: '',
			tipo: 'text',
			procesoId: this.procesoId
		};
	}
	
	cerrar() {
		this.dialogRef.close();
	}
}
