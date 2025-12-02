import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProJsToAdvplService } from '@totvs/protheus-lib-core';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresListService {

  private listZBC$ = new BehaviorSubject<Array<any>>([]);
  public solicitarRecarregarLista$ = new BehaviorSubject<boolean>(false);
  constructor(private proAppAdvpl: ProJsToAdvplService){}

  public loadZBC() {
    let listZBC: Array<any> = [
      {
        filial: '01',
        matricula: '001',
        client: 'XXXXXX',
        loja: "01",
        cpf: "11111111111",
        nome: 'João Silva',
        cadastrado_por: 'pedro.lucas',
        saldo_total: 300,
        historico: [
            {
            periodo: "092025",
            valor_credito: 100,
            valor_saldo: 100,
            periodo_atual: false
          },
          {
            periodo: "102025",
            valor_credito: 100,
            valor_saldo: 100,
            periodo_atual: false
          },
          {
            periodo: "112025",
            valor_credito: 100,
            valor_saldo: 100,
            periodo_atual: true
          }
        ]
      }
    ];
    this.listZBC$.next(listZBC);
    console.log('SELECIONADO MOCADO',this.listZBC$);
  }
  
  // BUSCANDO DO PROTHEUS
  public  loadZBCLibCore(listZBCParam: string) {
        
    let listZBC!: any;
    
    if(listZBCParam){
        listZBC = JSON.parse(listZBCParam);
    }
    this.listZBC$.next(listZBC);
    console.log('SELECIONADO DO PROTHEUS',this.listZBC$);
  }

  
  /** Observable público da lista */
  public getListZBC(): Observable<Array<any>> {
    return this.listZBC$.asObservable();
  }

  // 🟢 MÉTODO MOCK — simula retorno
  aguardarRetornoCreditoMock(payload: any): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          mensagem: 'Crédito salvo com sucesso (mock)!'
        });
      }, 1500);
    });
  }

  recarregarLista() {
    this.solicitarRecarregarLista$.next(true);
  }
  
  aguardarLoadZBCLibCore(): Promise<string> {
    console.log('SELECIONANDO O this.proAppAdvpl.jsToAdvpl para fazer o loadZBCLibCore');

    this.proAppAdvpl.jsToAdvpl('loadZBCLibCore', '');

    return new Promise(resolve => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('loadZBCLibCore');
        console.log('REALIZANDO GET ITEM DOS ITENS DO: loadZBCLibCore', item);
        if (item) {
          clearInterval(intervalo);
          resolve(item);
        }
      }, 100);
    });
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

  // 🟢 MÉTODO MOCK — simula retorno
  aguardarRetornoPeriodoMock(payload: any): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          mensagem: 'Crédito alterado com sucesso (mock)!'
        });
      }, 1500);
    });
  }

  aguardarRetornoPeriodo(payload: any): Promise<any> {
    this.proAppAdvpl.jsToAdvpl('editarPeriodo', JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('editarPeriodo');

        if (item) {
          clearInterval(intervalo);
          localStorage.removeItem('editarPeriodo');

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

  aguardarRetornoExclusaoPeriodo(payload: any): Promise<any> {

    this.proAppAdvpl.jsToAdvpl('excluirPeriodo', JSON.stringify(payload));

    return new Promise((resolve, reject) => {
      const intervalo = setInterval(() => {
        const item = localStorage.getItem('excluirPeriodo');

        if (item) {
          clearInterval(intervalo);
          localStorage.removeItem('excluirPeriodo');

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

  aguardarRetornoExclusaoPeriodoMock(payload: any): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          mensagem: 'Período excluído com sucesso (mock)!'
        });
      }, 1500);
    });
  }
}