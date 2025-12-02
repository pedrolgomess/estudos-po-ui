import { Component, ViewChild } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { NovoColaboradorComponent } from './novo-colaborador/novo-colaborador.component';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(NovoColaboradorComponent)
  novoColaboradorComp!: NovoColaboradorComponent;
  
  constructor(private proAppConfigService: ProAppConfigService) {
  }
 menus: Array<PoMenuItem> = [
    { label: 'Cadastrar Novo Colaborador',  action: () => this.novoColaboradorComp.abrirModal(),  icon: 'an an-user',   shortLabel: 'Cadastrar Novo Colaborador'  },
    { label: 'Exportar Relatório',          action: () => this.onClick(),                         icon: 'an an-clock',  shortLabel: 'Exportar Relatório'          },
    { label: 'Sair da Rotina',              action: () => this.closeApp(),                        icon: 'an an-user',   shortLabel: 'Sair da Rotina'              },

  ];

  private onClick() {
    alert('Função em Desenvolvimento');
  }
  
  private closeApp() {
    if (this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.callAppClose();
    } else {
      alert('O App não está sendo executado dentro do Protheus.');
    }
  }
}
