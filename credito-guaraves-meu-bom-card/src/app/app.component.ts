import { Component } from '@angular/core';

import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  readonly menus: Array<PoMenuItem> = [
    { label: 'Crédito Guaraves', action: this.onClick.bind(this) },
    { label: 'Cadastrar Novo Colaborador', action: this.onClick.bind(this) },
    { label: 'Exportar Relatório', action: this.onClick.bind(this) },
  ];

  private onClick() {
    alert('Clicked in menu item')
  }

}
