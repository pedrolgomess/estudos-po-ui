import { Component, OnInit, inject } from '@angular/core';

import { SamplePoListViewHiringProcessesService } from './sample-po-list-view-hiring-processes.service';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html'
})
export class ColaboradoresListComponent implements OnInit {
  private hiringProcessesService = inject(SamplePoListViewHiringProcessesService);

  hiringProcesses: Array<any> = [];
  colaboradoresFiltrados: Array<object> = [];
  modalDetail: boolean = false;


  ngOnInit() {
    this.hiringProcesses = this.hiringProcessesService.getItems();
    this.colaboradoresFiltrados = [...this.hiringProcesses];
  }

  formatTitle(item: any) {
    return `${item.nome}`;
  }

  showDetail() {
    return this.modalDetail;
  }

   filtrarPorBuscaRapida(search: string) {
    const termo = search?.toLowerCase() || '';
    this.colaboradoresFiltrados = this.hiringProcesses.filter(col =>
      col.nome.toLowerCase().includes(termo) ||
      col.matricula.includes(termo)
    );
  }

  filtrarBuscaAvancada(filters: any) {
    this.colaboradoresFiltrados = this.hiringProcesses.filter(col => {
      const nomeOk = !filters.nome || col.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matriculaOk = !filters.matricula || col.matricula.includes(filters.matricula);
      return nomeOk && matriculaOk;
    });
  }
}