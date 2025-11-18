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

  @HostListener('window:keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
      event.preventDefault();
    }
  }
  @ViewChild('modalNovoCredito', { static: true })
  modalNovoCredito!: PoModalComponent;
  isSaving = false;
  isLoadingList = false;
  // Inject do serviço de buscar a ZBC
  private hiringProcessesService = inject(SamplePoListViewHiringProcessesService);
  private subscription!: Subscription;
  hiringProcesses: Array<any> = [];
  colaboradoresFiltrados: Array<object> = [];
  modalDetail: boolean = false;


  async ngOnInit() {

    this.isLoadingList = true;

    // 1) Carregar dados primeiro (Protheus ou Mock)
    if (this.proAppCfg.insideProtheus()) {

      this.proAppAdvpl.jsToAdvpl('loadZBCLibCore', '');
      const content = await this.aguardarLoadZBCLibCore();
      this.hiringProcessesService.loadZBCLibCore(content);

    } else {

      this.hiringProcessesService.loadZBC();
    }

    // 2) Somente depois disso ouvir o Observable
    this.subscription = this.hiringProcessesService.getListZBC().subscribe(list => {

      this.hiringProcesses = list;
      this.colaboradoresFiltrados = [...list];

      // 3) Agora sim desliga o loading
      setTimeout(() => this.isLoadingList = false, 2000)
    });

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

  async salvarCredito() {

    if (!this.periodo || !this.valorCredito) {
      this.notify.warning('Preencha o período e o valor do crédito.');
      return;
    }

    this.isSaving = true;

    const dados = {
      filial: this.selectedItem.filial,
      matricula: this.selectedItem.matricula,
      periodo: this.periodo,
      valorCredito: this.valorCredito,
      saldo: this.saldo
    };

    try {
      let retorno;

      if (this.proAppCfg.insideProtheus()) {

        console.log(">>> Executou salvarCredito()");
        console.log(">>> Dentro do Protheus? ", this.proAppCfg.insideProtheus());
        retorno = await this.aguardarRetornoCredito(dados);

      } else {
        retorno = await this.hiringProcessesService.aguardarRetornoCreditoMock(dados);
      }

      this.notify.success(retorno.mensagem);
      this.modalNovoCredito.close();
      this.restaurarFormulario();

    } catch (err: any) {
      this.notify.error(err?.mensagem || 'Erro ao salvar crédito!');
    } finally {
      this.isSaving = false;
    }
  }


  restaurarFormulario() {
    this.periodo = '';
    this.valorCredito = null;
    this.saldo = null;
  }

  aguardarRetornoCredito(payload: any): Promise<any> {
    console.log(">>> Executou salvarCredito() e entrou em aguardarRetornoCredito");
    console.log(">>> Dentro do Protheus? ", this.proAppCfg.insideProtheus());
    // 1) Dispara chamada para o Protheus
    this.proAppAdvpl.jsToAdvpl('salvarCredito', JSON.stringify(payload));

    // 2) Aguarda retorno via localStorage
    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('salvarCredito');
        console.log('RETORNO DO ITEM NO PROTHEUS: ', item);
        if (item) {
          clearInterval(intervalo);
          localStorage.removeItem('salvarCredito');

          try {
            const json = JSON.parse(item);
            console.log('JSON RECEBIDO DO ITEM NO PROTHEUS: ', json);
            if (json.status === 'OK') {
              resolve({ mensagem: json.mensagem });
            } else {
              reject({ mensagem: json.mensagem });
            }

          } catch {
            reject({ mensagem: 'Erro ao interpretar o retorno!' });
          }
        }
      }, 100); // verifica a cada 100ms
    });
  }

}