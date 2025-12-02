import { Component, OnInit, OnDestroy, ViewChild, HostListener, inject } from '@angular/core';
import { PoModalComponent, PoNotificationService, PoListViewAction } from '@po-ui/ng-components';
import { ColaboradoresListService } from './colaboradores-list.service';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { Subscription, filter } from 'rxjs';

// Utils
import { validarPeriodoFinal, formatarCpf, calcularSaldo } from '../utils/colaboradores-utils';

// Helpers
import { prepararNovoCredito, prepararEdicaoPeriodo, restaurarFormulario as limparForm } from '../helpers/colaboradores-modal.helper';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html',
  styleUrls: ['./colaboradores-list.scss']
})
export class ColaboradoresListComponent implements OnInit, OnDestroy {

  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  protheusService = inject(ColaboradoresListService);
  private hiringService = inject(ColaboradoresListService);

  private subscription = new Subscription();

  @ViewChild('modalNovoCredito') modalNovoCredito!: PoModalComponent;
  @ViewChild('modalEditarPeriodo') modalEditarPeriodo!: PoModalComponent;

  isSaving = false;
  isLoadingList = false;

  selectedItem: any = null;
  collaborators: any[] = [];
  colaboradoresFiltrados: any[] = [];

  periodo = '';
  valorCredito: number | null = null;
  saldo: number | null = null;

  // --------------------------------------------------------------------
  // INIT
  // --------------------------------------------------------------------
  async ngOnInit() {
    this.isLoadingList = true;

    this.subscription.add(
      this.hiringService.getListZBC()
        .pipe(filter(l => !!l))
        .subscribe(lista => {
          this.collaborators = lista;
          this.colaboradoresFiltrados = [...lista];
          this.isLoadingList = false;
        })
    );

    this.subscription.add(
      this.hiringService.solicitarRecarregarLista$
        .subscribe(() => this.recarregarLista())
    );

    this.carregarListaInicial();
  }

  formatTitle(item: any) {
    return `${item.nome} | Código: ${item.client} - ${item.loja}`;
  }

  showDetail() {
    return false;
  }
  carregarListaInicial() {
    if (this.proAppCfg.insideProtheus()) {
      this.protheusService.aguardarLoadZBCLibCore().then(content =>
        this.hiringService.loadZBCLibCore(content)
      );
    } else {
      this.hiringService.loadZBC();
    }
  }

  recarregarLista() {
    this.isLoadingList = true;
    this.carregarListaInicial();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // --------------------------------------------------------------------
  // MODAL
  // --------------------------------------------------------------------
  abrirNovoCredito(item: any) {
    prepararNovoCredito(this, item);
  }
  // -----------------------------------------------------
  // AÇÕES
  // -----------------------------------------------------
  readonly actions: Array<PoListViewAction> = [
    { label: 'Novo Crédito', icon: 'po-icon-plus', action: (item: any) => this.abrirNovoCredito(item) }
  ];
  
  // -----------------------------------------------------
  // FILTROS
  // -----------------------------------------------------
  filtrarPorBuscaRapida(search: string) {
    const termo = search.toLowerCase();
    this.colaboradoresFiltrados = this.collaborators.filter(col =>
      col.nome.toLowerCase().includes(termo) || col.matricula.includes(termo)
    );
  }

  filtrarBuscaAvancada(filters: any) {
    this.colaboradoresFiltrados = this.collaborators.filter(col => {
      const nomeOk = !filters.nome || col.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matriculaOk = !filters.matricula || col.matricula.includes(filters.matricula);
      return nomeOk && matriculaOk;
    });
  }
  abrirEditarNovoPeriodo(item: any, hist: any) {
    prepararEdicaoPeriodo(this, item, hist);
  }

  onValorCreditoChange(value: any) {
    this.saldo = calcularSaldo(value);
  }

  restaurarFormulario(){
    limparForm(this)
  }

  // --------------------------------------------------------------------
  // SALVAR CRÉDITO
  // --------------------------------------------------------------------
  async salvarCredito() {

    if (!this.periodo || !this.valorCredito) {
      this.notify.warning('Preencha o período e o valor do crédito.');
      return;
    }

    if (!this.valorCredito) {
      this.notify.warning('Preencha o valor do crédito.');
      return;
    }

    if (!validarPeriodoFinal(this.periodo)) {
      return this.notify.warning('Período inválido. Use MMYYYY.');
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
        ? await this.protheusService.aguardarRetornoCredito(dados)
        : await this.hiringService.aguardarRetornoCreditoMock(dados);

      this.notify.success(retorno.mensagem);
      this.modalNovoCredito.close();
      limparForm(this);

      this.hiringService.recarregarLista();

    } finally {
      this.isSaving = false;
    }
  }

  formatarCpf(cpf: string) {
    return formatarCpf(cpf);
  }
}
