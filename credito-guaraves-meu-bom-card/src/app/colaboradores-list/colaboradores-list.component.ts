import { Component, OnInit, inject, OnDestroy, HostListener, ViewChild } from '@angular/core';

import { SamplePoListViewHiringProcessesService } from './sample-po-list-view-hiring-processes.service';
import { PoListViewAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { ProAppConfigService, ProJsToAdvplService } from '@totvs/protheus-lib-core'; // Importing ProtheusLibCoreModule for Protheus integration
import { Subscription } from 'rxjs';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html'
})
export class ColaboradoresListComponent implements OnInit, OnDestroy {

  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  proAppAdvpl = inject(ProJsToAdvplService);

  @HostListener('window:keydown',['$event'])
  handleKeyBoardEvent(event: KeyboardEvent){
     if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
      event.preventDefault();
    }   
  }
  @ViewChild('modalNovoCredito', { static: true })
  modalNovoCredito!: PoModalComponent;
  isSaving = false;
  // Inject do serviço de buscar a ZBC
  private hiringProcessesService = inject(SamplePoListViewHiringProcessesService);
  private subscription!: Subscription;
  hiringProcesses: Array<any> = [];
  colaboradoresFiltrados: Array<object> = [];
  modalDetail: boolean = false;


  async ngOnInit() {

    this.subscription = this.hiringProcessesService.getListZBC().subscribe(list => {
      this.hiringProcesses = list;
      this.colaboradoresFiltrados = [...list];
    });
    //Se estiver no protheus busca através do jsToAdvpl
    if(this.proAppCfg.insideProtheus()) {
      
      this.proAppAdvpl.jsToAdvpl('loadZBCLibCore', '');
      const content = await this.aguardarLoadZBCLibCore();
      this.hiringProcessesService.loadZBCLibCore(content);
      
    } else {
      // Se não, carrega mocado
      this.hiringProcessesService.loadZBC();
      console.log('SELECIONADO CARREGANDO',this.hiringProcessesService);
    }
    //Inicia o processo de buscar os itens
    this.colaboradoresFiltrados = [...this.hiringProcesses];
  }

  aguardarLoadZBCLibCore(): Promise<string> {
    return new Promise((resolve) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('loadZBCLibCore');
        if (item !== null) {
          clearInterval(intervalo);
          resolve(item);
        }
      }, 100); // verifica a cada 100ms
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  formatTitle(item: any) {
    return `${item.nome} | Código: ${item.client} - ${item.loja}`;
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

  readonly actions: Array<PoListViewAction> = [
    {
      label: 'Novo Crédito',
      icon: 'po-icon-plus',
      action: (item: any) => this.abrirNovoCredito(item)
    }
  ];

  selectedItem: any = null;
  periodo: string = '';
  valorCredito: number | null = null;
  saldo: number | null = null;

  abrirNovoCredito(item: any) {
    this.selectedItem = item;

    // Zera campos de edição
    this.periodo = '';
    this.valorCredito = null;
    this.saldo = null;

    this.modalNovoCredito.open();
  }
  onValorCreditoChange(value: any) {
    this.saldo = Number(value) || 0;
  }
  salvarCredito() {
    const dados = {
      filial: this.selectedItem.filial,
      matricula: this.selectedItem.matricula,
      periodo: this.periodo,
      valorCredito: this.valorCredito,
      saldo: this.saldo
    };

    console.log('Enviando payload:', dados);

    // Aqui você faz seu POST via seu service...
    // this.service.salvarCredito(dados).subscribe(...)

    this.modalNovoCredito.close();
  }
}