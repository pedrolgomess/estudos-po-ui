import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SamplePoListViewHiringProcessesService {

  private listZBC$ = new BehaviorSubject<Array<any>>([]);

  constructor(){}

  loadZBC() {
    let listZBC: Array<any> = [
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
    this.listZBC$.next(listZBC);
    console.log('SELECIONADO MOCADO',this.listZBC$);
    return (listZBC);
  }
  
  // BUSCANDO DO PROTHEUS
  public  loadZBCLibCore(listZBCParam: string) {
        
        let listZBC!: any;
        
        if(listZBCParam){
            listZBC = JSON.parse(listZBCParam);
        }
      console.log('SELECIONADO DO PROTHEUS',this.listZBC$);
        return (listZBC);
  }
}