export function prepararNovoCredito(component: any, item: any) {
  component.selectedItem = item;
  component.periodo = '';
  component.valorCredito = null;
  component.saldo = null;
  component.modalNovoCredito.open();
}

export function prepararEdicaoPeriodo(component: any, item: any, hist: any) {
  component.selectedItem = item;
  component.periodo = hist.periodo;
  component.valorCredito = hist.valor_credito;
  component.saldo = hist.valor_saldo;
  component.modalEditarPeriodo.open();
}

export function restaurarFormulario(component: any) {
  component.periodo = '';
  component.valorCredito = null;
  component.saldo = null;
}
