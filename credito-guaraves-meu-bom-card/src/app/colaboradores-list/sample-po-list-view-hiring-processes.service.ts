import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SamplePoListViewHiringProcessesService {
  getItems() {
    return [
      {
        matricula: '001',
        nome: 'João Silva',
        cargo: 'Analista',
        email: "joao@empresa.com",
        saldo_total: 200,
        historico: [
            {
            periodo: "092025",
            valor_credito: 100,
            valor_saldo: 100
          },
          {
            periodo: "102025",
            valor_credito: 100,
            valor_saldo: 100
          }
        ]
      },
      {
        matricula: '002',
        nome: 'Pedro',
        cargo: 'Analista',
        email: "joao@empresa.com",
        saldo_total: 200,
        historico: [
            {
            periodo: "092025",
            valor_credito: 100,
            valor_saldo: 100
          },
          {
            periodo: "102025",
            valor_credito: 100,
            valor_saldo: 100
          }
        ]
      }
    ];
  }
}