import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { ProAppConfigService, ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { NovoColaboradorService } from './novo-colaborador.service';
import { ColaboradoresListService } from '../colaboradores-list/colaboradores-list.service';

// Utils
import { validarPeriodoFinalUtil, calcularSaldoUtil } from '../utils/colaboradores-utils';

// Helpers
import { prepararNovoColaboradorHelper, restaurarFormularioColaboradorHelper as limparForm } from '../helpers/colaboradores-modal.helper';

@Component({
  selector: 'novo-colaborador',
  templateUrl: './novo-colaborador.component.html'
})
export class NovoColaboradorComponent {
  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  proAppAdvpl = inject(ProJsToAdvplService);
  private novoColaboradorService = inject(NovoColaboradorService);
  private colaboradoresListService = inject(ColaboradoresListService)

  @HostListener('window:keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) event.preventDefault();
  }

  @ViewChild('modalNovoColaborador', { static: false })
  modalNovoColaborador!: PoModalComponent;

  isSaving = false;
  selectedItem: any = null;
  filial = '';
  matricula = '';
  periodo = '';
  valorCredito: number | null = null;
  saldo: number | null = null;

  abrirModal() {
    prepararNovoColaboradorHelper(this);
  }

  // --------------------------------------------------------------------
  // RESTAURAR FORMULÁRIO
  // --------------------------------------------------------------------
  restaurarFormulario(){
    limparForm(this)
  }

  // --------------------------------------------------------------------
  // CHANGE DO VALOR 
  // --------------------------------------------------------------------
  onValorCreditoChange(value: any) {
    this.saldo = calcularSaldoUtil(value);
  }

  // -----------------------------------------------------
  // SALVAR NOVO COLABORADOR
  // -----------------------------------------------------
  async salvarNovoColaborador() {

    if (!this.periodo || !this.valorCredito) {
      this.notify.warning('Preencha o período e o valor do crédito.');
      return;
    }

    if (!this.valorCredito) {
      this.notify.warning('Preencha o valor do crédito.');
      return;
    }

    if (!validarPeriodoFinalUtil(this.periodo)) {
      this.notify.warning('Período inválido. Use MMYYYY, ex: 092025');
      return;
    }

    this.isSaving = true;

    const dados = {
      filial: this.filial,
      matricula: this.matricula,
      periodo: this.periodo,
      valorCredito: this.valorCredito,
      saldo: this.saldo
    };

    try {

      const retorno = this.proAppCfg.insideProtheus()
        ? await this.novoColaboradorService.aguardarRetornoNovoColaborador(dados)
        : await this.novoColaboradorService.aguardarRetornoNovoColaboradorMock(dados);

      // --------------------------------------
      // 🔥 TRATAMENTO DOS CÓDIGOS DO BACKEND
      // --------------------------------------
      if (retorno.code === 201) {
        // SUCESSO
        this.notify.success(retorno.mensagem);
        this.modalNovoColaborador.close();
        this.restaurarFormulario();
        // 🔥 ATUALIZA A LISTA NA TELA INICIAL
        this.colaboradoresListService.recarregarLista();
        return;
      }

      // ERROS (404 ou 409)
      if (retorno.code === 404 || retorno.code === 409) {
        this.notify.error(retorno.mensagem);
        return;
      }

      // Caindo aqui é porque veio algo inesperado
      this.notify.error('Erro desconhecido ao salvar colaborador!');

    } catch (err: any) {
      this.notify.error(err?.mensagem || 'Erro ao salvar crédito!');
    } finally {
      this.isSaving = false;
    }
  }

}
