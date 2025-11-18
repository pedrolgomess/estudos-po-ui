import { Component, OnInit, inject, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { SamplePoListViewHiringProcessesService } from './sample-po-list-view-hiring-processes.service';
import { PoListViewAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { ProAppConfigService, ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html'
})
export class ColaboradoresListComponent implements OnInit, OnDestroy {

  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  proAppAdvpl = inject(ProJsToAdvplService);
  private hiringProcessesService = inject(SamplePoListViewHiringProcessesService);

  private subscription = new Subscription();

  @HostListener('window:keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) event.preventDefault();
  }

  @ViewChild('modalNovoCredito', { static: true }) modalNovoCredito!: PoModalComponent;
  @ViewChild('periodoInput', { static: false }) periodoInput: any;

  isSaving = false;
  isLoadingList = false;

  hiringProcesses: Array<any> = [];
  colaboradoresFiltrados: Array<object> = [];
  modalDetail = false;

  selectedItem: any = null;
  periodo = '';
  valorCredito: number | null = null;
  saldo: number | null = null;

  // -----------------------------------------------------
  // INIT
  // -----------------------------------------------------
  async ngOnInit() {

    this.isLoadingList = true;

    // Atualiza a lista sempre que o serviço emitir uma nova
    this.subscription.add(
      this.hiringProcessesService.getListZBC()
        .pipe(filter(lista => !!lista)) // ignora emissão inicial null
        .subscribe(lista => {
          this.hiringProcesses = lista;
          this.colaboradoresFiltrados = [...lista];
          this.isLoadingList = false;
        })
    );

    // Quando o service mandar recarregar → executa recarregarLista()
    this.subscription.add(
      this.hiringProcessesService.solicitarRecarregarLista$
        .subscribe(() => this.recarregarLista())
    );

    // Primeira carga
    this.carregarListaInicial();
  }

  // -----------------------------------------------------
  // PRIMEIRA CARGA
  // -----------------------------------------------------
  private async carregarListaInicial() {
    if (this.proAppCfg.insideProtheus()) {
      this.proAppAdvpl.jsToAdvpl('loadZBCLibCore', '');
      const content = await this.aguardarLoadZBCLibCore();
      this.hiringProcessesService.loadZBCLibCore(content);
    } else {
      this.hiringProcessesService.loadZBC();
    }
  }

  // -----------------------------------------------------
  // PROTHEUS - AGUARDAR LOCALESTORAGE
  // -----------------------------------------------------
  aguardarLoadZBCLibCore(): Promise<string> {
    return new Promise(resolve => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('loadZBCLibCore');
        if (item !== null) {
          clearInterval(intervalo);
          resolve(item);
        }
      }, 100);
    });
  }

  // -----------------------------------------------------
  // RECARREGAR LISTA
  // -----------------------------------------------------
  recarregarLista() {
    this.isLoadingList = true;

    if (this.proAppCfg.insideProtheus()) {
      this.proAppAdvpl.jsToAdvpl('loadZBCLibCore', '');
      this.aguardarLoadZBCLibCore().then(content => {
        this.hiringProcessesService.loadZBCLibCore(content);
      });
    } else {
      this.hiringProcessesService.loadZBC();
    }
  }

  // -----------------------------------------------------
  // DESTROY
  // -----------------------------------------------------
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatTitle(item: any) {
    return `${item.nome} | Código: ${item.client} - ${item.loja}`;
  }

  showDetail() {
    return this.modalDetail;
  }
  // -----------------------------------------------------
  // FILTROS
  // -----------------------------------------------------
  filtrarPorBuscaRapida(search: string) {
    const termo = search.toLowerCase();
    this.colaboradoresFiltrados = this.hiringProcesses.filter(col =>
      col.nome.toLowerCase().includes(termo) || col.matricula.includes(termo)
    );
  }

  filtrarBuscaAvancada(filters: any) {
    this.colaboradoresFiltrados = this.hiringProcesses.filter(col => {
      const nomeOk = !filters.nome || col.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matriculaOk = !filters.matricula || col.matricula.includes(filters.matricula);
      return nomeOk && matriculaOk;
    });
  }

  // -----------------------------------------------------
  // AÇÕES
  // -----------------------------------------------------
  readonly actions: Array<PoListViewAction> = [
    { label: 'Novo Crédito', icon: 'po-icon-plus', action: (item: any) => this.abrirNovoCredito(item) }
  ];

  abrirNovoCredito(item: any) {
    this.selectedItem = item;
    this.periodo = '';
    this.valorCredito = null;
    this.saldo = null;
    this.modalNovoCredito.open();
  }

  onValorCreditoChange(value: any) {
    this.saldo = Number(value) || 0;
  }

  // -----------------------------------------------------
  // SALVAR CRÉDITO
  // -----------------------------------------------------
  async salvarCredito() {

    if (!this.periodo || !this.valorCredito) {
      this.notify.warning('Preencha o período e o valor do crédito.');
      return;
    }

    if (!this.validarPeriodoFinal()) {
      this.notify.warning('Período inválido. Use MMYYYY, ex: 092025');
      return;
    }

    if (!this.valorCredito) {
      this.notify.warning('Preencha o valor do crédito.');
      return;
    }

    this.isSaving = true;

    const dados = {
      filial: this.selectedItem.filial,
      matricula: this.selectedItem.matricula,
      client: this.selectedItem.client,
      loja: this.selectedItem.loja,
      cpf: this.selectedItem.cpf,
      periodo: this.periodo,
      valorCredito: this.valorCredito,
      saldo: this.saldo
    };

    try {
      const retorno = this.proAppCfg.insideProtheus()
        ? await this.aguardarRetornoCredito(dados)
        : await this.hiringProcessesService.aguardarRetornoCreditoMock(dados);

      this.notify.success(retorno.mensagem);
      this.modalNovoCredito.close();
      this.restaurarFormulario();

      // 🔥 dispara recarga geral
      this.hiringProcessesService.recarregarLista();

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
    this.proAppAdvpl.jsToAdvpl('salvarCredito', JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('salvarCredito');

        if (item) {
          clearInterval(intervalo);
          localStorage.removeItem('salvarCredito');

          try {
            const json = JSON.parse(item);
            json.status === 'OK'
              ? resolve({ mensagem: json.mensagem })
              : reject({ mensagem: json.mensagem });

          } catch {
            reject({ mensagem: 'Erro ao interpretar retorno!' });
          }
        }
      }, 100);
    });
  }

  validarPeriodoFinal(): boolean {
    const valor = this.periodo || '';
    if (valor.length !== 6) return false;
    return /^(0[1-9]|1[0-2])(19|20)\d{2}$/.test(valor);
  }

  formatarCpf(cpf: string | undefined): string {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}
