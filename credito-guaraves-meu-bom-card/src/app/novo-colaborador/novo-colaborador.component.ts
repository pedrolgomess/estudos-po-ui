import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { PoListViewAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';
import { ProAppConfigService, ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { Subscription, filter } from 'rxjs';
import { NovoColaboradorService } from './novo-colaborador-service';
import { SamplePoListViewHiringProcessesService } from '../colaboradores-list/sample-po-list-view-hiring-processes.service';

@Component({
  selector: 'novo-colaborador',
  templateUrl: './novo-colaborador.component.html'
})
export class NovoColaboradorComponent {
  notify = inject(PoNotificationService);
  proAppCfg = inject(ProAppConfigService);
  proAppAdvpl = inject(ProJsToAdvplService);
  private novoColaboradorService = inject(NovoColaboradorService);
  private colaboradoresListService = inject(SamplePoListViewHiringProcessesService)

  @HostListener('window:keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) event.preventDefault();
  }

  @ViewChild('modalNovoColaborador', { static: false })
  modalNovoColaborador!: PoModalComponent;

  @ViewChild('periodoInput', { static: false }) periodoInput: any;

  isSaving = false;
  selectedItem: any = null;
  filial = '';
  matricula = '';
  periodo = '';
  valorCredito: number | null = null;
  saldo: number | null = null;

  abrirModal() {
    this.modalNovoColaborador.open();
  }

  restaurarFormulario() {
    this.filial = '';
    this.matricula = '';
    this.periodo = '';
    this.valorCredito = null;
    this.saldo = null;
  }

  onValorCreditoChange(value: any) {
    this.saldo = Number(value) || 0;
  }
  // -----------------------------------------------------
  // SALVAR CRÉDITO
  // -----------------------------------------------------
  async salvarNovoColaborador() {

    if (!this.periodo || !this.valorCredito) {
      this.notify.warning('Preencha o período e o valor do crédito.');
      return;
    }

    if (!this.validarPeriodoFinal()) {
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
        ? await this.aguardarRetornoNovoColaborador(dados)
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


  validarPeriodoFinal(): boolean {
    const valor = this.periodo || '';
    if (valor.length !== 6) return false;
    return /^(0[1-9]|1[0-2])(19|20)\d{2}$/.test(valor);
  }

  aguardarRetornoNovoColaborador(payload: any): Promise<any> {
    this.proAppAdvpl.jsToAdvpl('novoColaborador', JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('novoColaborador');

        if (item) {
          clearInterval(intervalo);
          localStorage.removeItem('novoColaborador');

          try {
            const json = JSON.parse(item);

            // 🔥 Garantir retorno padronizado
            const retorno = {
              code: json.code,
              status: json.status,
              mensagem: json.mensagem
            };

            if (json.status === 'OK') {
              resolve(retorno);
            } else {
              reject(retorno);
            }

          } catch {
            reject({
              code: 500,
              status: 'ERRO',
              mensagem: 'Erro ao interpretar retorno!'
            });
          }
        }
      }, 100);
    });
  }
}
