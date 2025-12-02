export function prepararNovoCreditoHelper(component: any, item: any) {
  component.selectedItem = item;
  component.periodo = '';
  component.valorCredito = null;
  component.saldo = null;
  component.modalNovoCredito.open();
}

export function prepararEdicaoPeriodoHelper(component: any, item: any, hist: any) {
  component.selectedItem = item;
  component.periodo = hist.periodo;
  component.valorCredito = hist.valor_credito;
  component.saldo = hist.valor_saldo;
  component.modalEditarPeriodo.open();
}

export function restaurarFormularioCreditoHelper(component: any) {
  component.periodo = '';
  component.valorCredito = null;
  component.saldo = null;
}

export function prepararNovoColaboradorHelper(component: any) {

    component.modalNovoColaborador.open();
}

export function restaurarFormularioColaboradorHelper(component: any) {
  component.filial = '';
  component.matricula = '';
  component.periodo = '';
  component.valorCredito = null;
  component.saldo = null;
}