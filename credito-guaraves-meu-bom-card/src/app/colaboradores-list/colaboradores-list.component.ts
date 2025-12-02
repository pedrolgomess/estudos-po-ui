import { Component, OnInit, OnDestroy, ViewChild, HostListener, inject } from '@angular/core';
import { PoModalComponent, PoNotificationService, PoListViewAction } from '@po-ui/ng-components';
import { ColaboradoresListService } from './colaboradores-list.service';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { Subscription, filter } from 'rxjs';
import { ProJsToAdvplService } from '@totvs/protheus-lib-core';
// Utils
import { validarPeriodoFinalUtil, formatarCpfUtil, calcularSaldoUtil } from '../utils/colaboradores-utils';

// Helpers
import { prepararNovoCreditoHelper, prepararEdicaoPeriodoHelper, restaurarFormularioCreditoHelper as limparForm } from '../helpers/colaboradores-modal.helper';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html',
  styleUrls: ['./colaboradores-list.scss']
})
export class ColaboradoresListComponent implements OnInit, OnDestroy {

  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  proAppAdvpl = inject(ProJsToAdvplService);
  colaboradoresService = inject(ColaboradoresListService);

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
      this.colaboradoresService.getListZBC()
        .pipe(filter(l => !!l))
        .subscribe(lista => {
          this.collaborators = lista;
          this.colaboradoresFiltrados = [...lista];
          this.isLoadingList = false;
        })
    );

    this.subscription.add(
      this.colaboradoresService.solicitarRecarregarLista$
        .subscribe(() => this.recarregarLista())
    );

    this.carregarListaInicial();
  }

  // -----------------------------------------------------
  // FORMATAR TÍTULO
  // -----------------------------------------------------
  formatTitle(item: any) {
    return `${item.nome} | Código: ${item.client} - ${item.loja}`;
  }

  // -----------------------------------------------------
  // MOSTRAR DETALHES
  // -----------------------------------------------------
  showDetail() {
    return false;
  }

  // -----------------------------------------------------
  // RECARREGAR A LISTA INICIAL
  // -----------------------------------------------------
  async carregarListaInicial() {
    if (this.proAppCfg.insideProtheus()) {
      await this.colaboradoresService.aguardarLoadZBCLibCore().then(content =>
        this.colaboradoresService.loadZBCLibCore(content)
      );
    } else {
      this.colaboradoresService.loadZBC();
    }
  }

  // -----------------------------------------------------
  // RECARREGAR A LISTA INICIAL
  // -----------------------------------------------------
  recarregarLista() {
    this.isLoadingList = true;
    this.carregarListaInicial();
  }

  // -----------------------------------------------------
  // NG DESTROY
  // -----------------------------------------------------
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // --------------------------------------------------------------------
  // ABRIR O MODAL DE NOVO CRÉDITO
  // --------------------------------------------------------------------
  abrirNovoCredito(item: any) {
    prepararNovoCreditoHelper(this, item);
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

  // --------------------------------------------------------------------
  // FILTRAR POR NOME OU MATRÍCULA
  // --------------------------------------------------------------------
  filtrarBuscaAvancada(filters: any) {
    this.colaboradoresFiltrados = this.collaborators.filter(col => {
      const nomeOk = !filters.nome || col.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matriculaOk = !filters.matricula || col.matricula.includes(filters.matricula);
      return nomeOk && matriculaOk;
    });
  }

  // --------------------------------------------------------------------
  // ABRIR O MODAL DE EDITAR NOVO PERÍODO
  // --------------------------------------------------------------------
  abrirEditarNovoPeriodo(item: any, hist: any) {
    prepararEdicaoPeriodoHelper(this, item, hist);
  }

  // --------------------------------------------------------------------
  // CHANGE DO VALOR 
  // --------------------------------------------------------------------
  onValorCreditoChange(value: any) {
    this.saldo = calcularSaldoUtil(value);
  }

  // --------------------------------------------------------------------
  // RESTAURAR FORMULÁRIO
  // --------------------------------------------------------------------
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

    if (!validarPeriodoFinalUtil(this.periodo)) {
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
        ? await this.colaboradoresService.aguardarRetornoCredito(dados)
        : await this.colaboradoresService.aguardarRetornoCreditoMock(dados);

      this.notify.success(retorno.mensagem);
      this.modalNovoCredito.close();
      limparForm(this);

      this.colaboradoresService.recarregarLista();

    } catch (err: any) {
      this.notify.error(err?.mensagem || 'Erro ao salvar crédito!');
    } finally {
      this.isSaving = false;
    }
  }

  // --------------------------------------------------------------------
  // FORMATAR CPF
  // --------------------------------------------------------------------
  formatarCpf(cpf: string) {
    return formatarCpfUtil(cpf);
  }
}
