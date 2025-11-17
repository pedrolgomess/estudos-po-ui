import { Component, ViewChild } from '@angular/core';
import { ColaboradoresListComponent } from '../colaboradores-list/colaboradores-list.component';

@Component({
  selector: 'buscar-colaboradores-dinamicamente',
  templateUrl: './buscar-colaboradores-dinamicamente.component.html'
})
export class BuscarColaboradoresDinamicamenteComponent {

  @ViewChild(ColaboradoresListComponent)
  listaColaboradores!: ColaboradoresListComponent;

  onQuickSearch(search: string) {
    if (this.listaColaboradores) {
      this.listaColaboradores.filtrarPorBuscaRapida(search);
    }
  }

  onAdvancedSearch(filters: any) {
    if (this.listaColaboradores) {
      this.listaColaboradores.filtrarBuscaAvancada(filters);
    }
  }
}
