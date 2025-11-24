import { Component, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'novo-colaborador',
  templateUrl: './novo-colaborador.component.html'
})
export class NovoColaboradorComponent {

  @ViewChild('modalNovoColaborador', { static: false })
  modalNovoColaborador!: PoModalComponent;

  abrirModal() {
    this.modalNovoColaborador.open();
  }
}
