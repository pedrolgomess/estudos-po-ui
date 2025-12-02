export function validarPeriodoFinalUtil(periodo: string): boolean {
  if (!periodo || periodo.length !== 6) return false;
  return /^(0[1-9]|1[0-2])(19|20)\d{2}$/.test(periodo);
}

export function formatarCpfUtil(cpf: string | undefined): string {
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cleaned;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function calcularSaldoUtil(valor: any): number {
  return Number(valor) || 0;
}
