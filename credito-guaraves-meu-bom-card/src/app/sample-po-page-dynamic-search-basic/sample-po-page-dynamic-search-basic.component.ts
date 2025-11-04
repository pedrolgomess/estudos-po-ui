import { Component, ViewChild } from '@angular/core';
import { ColaboradoresListComponent } from '../colaboradores-list/colaboradores-list.component';

@Component({
  selector: 'sample-po-page-dynamic-search-basic',
  templateUrl: './sample-po-page-dynamic-search-basic.component.html'
})
export class SamplePoPageDynamicSearchBasicComponent {

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
