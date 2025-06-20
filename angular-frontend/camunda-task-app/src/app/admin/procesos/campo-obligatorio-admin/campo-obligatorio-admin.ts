import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CampoObligatorioService } from './campo-obligatorio.service';
import { CampoObligatorio } from './campo-obligatorio.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-campo-obligatorio-admin',
	standalone: true,
	imports: [FormsModule,CommonModule],  // <-- AGREGA ESTO
	templateUrl: './campo-obligatorio-admin.html',
	styleUrls: ['./campo-obligatorio-admin.css']
})
export class CampoObligatorioAdmin implements OnInit,OnChanges {
	@Input() procesoId!: number;
	campos: CampoObligatorio[] = [];
	campoActual: CampoObligatorio = this.nuevoCampo();
	editando = false;
	
	constructor(private campoService: CampoObligatorioService) 
	{
	}
	//procesoId!: number;
	
	ngOnInit() {
		if (this.procesoId) {
			this.cargarCampos();
		}
	}
	
	ngOnChanges(changes: SimpleChanges) {
		if (changes['procesoId'] && changes['procesoId'].currentValue) {
			this.cargarCampos();
		}
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
}
