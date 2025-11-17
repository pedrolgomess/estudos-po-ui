import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplePoListViewHiringProcessesService {

  private listZBC$ = new BehaviorSubject<Array<any>>([]);

  constructor(){}

  public loadZBC() {
    let listZBC: Array<any> = [
      {
        filial: '01',
        matricula: '001',
        client: 'XXXXXX',
        loja: "01",
        cpf: "XXX.XXX.XXX-XX",
        nome: 'João Silva',
        cadastrado_por: 'pedro.lucas',
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
        filial: '01',
        matricula: '002',
        client: 'XXXXXX',
        loja: "01",
        cpf: "XXX.XXX.XXX-XX",
        nome: 'Pedro',
        cadastrado_por: 'pedro.lucas',
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
}