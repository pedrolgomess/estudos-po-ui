import { Component, ViewChild } from '@angular/core';
import { PoMenuItem } from '@po-ui/ng-components';
import { NovoColaboradorComponent } from './novo-colaborador/novo-colaborador.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild(NovoColaboradorComponent)
  novoColaboradorComp!: NovoColaboradorComponent;
  
 menus: Array<PoMenuItem> = [
    { label: 'Cadastrar Novo Colaborador',  action: () => this.novoColaboradorComp.abrirModal(), icon: 'an an-user', shortLabel: 'Cadastrar Novo Colaborador' },
    {
      label: 'Exportar Relatório',
       action: this.onClick.bind(this),
      icon: 'an an-clock',
      shortLabel: 'Exportar Relatório',
    },

  ];

  private onClick() {
    alert('Clicked in menu item');
  }
}
