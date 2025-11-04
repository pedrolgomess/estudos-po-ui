import { Component } from '@angular/core';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html'
})
export class ColaboradoresListComponent {

  colaboradores = [
    { matricula: '001', nome: 'João Silva', cargo: 'Analista', email: 'joao@empresa.com' },
    { matricula: '002', nome: 'Maria Souza', cargo: 'Gerente', email: 'maria@empresa.com' },
    { matricula: '003', nome: 'Carlos Lima', cargo: 'Assistente', email: 'carlos@empresa.com' },
    { matricula: '004', nome: 'Fernanda Oliveira', cargo: 'Coordenadora', email: 'fernanda@empresa.com' },
    { matricula: '005', nome: 'Pedro Lucas', cargo: 'Desenvolvedor', email: 'pedro@empresa.com' }
  ];

  colaboradoresFiltrados = [...this.colaboradores];

  columns = [
    { property: 'matricula', label: 'Matrícula', width: '15%' },
    { property: 'nome', label: 'Nome', width: '25%' },
    { property: 'cargo', label: 'Cargo', width: '25%' },
    { property: 'email', label: 'E-mail', width: '35%' }
  ];

  filtrarPorBuscaRapida(search: string) {
    const termo = search?.toLowerCase() || '';
    this.colaboradoresFiltrados = this.colaboradores.filter(col =>
      col.nome.toLowerCase().includes(termo) ||
      col.matricula.includes(termo)
    );
  }

  filtrarBuscaAvancada(filters: any) {
    this.colaboradoresFiltrados = this.colaboradores.filter(col => {
      const nomeOk = !filters.nome || col.nome.toLowerCase().includes(filters.nome.toLowerCase());
      const matriculaOk = !filters.matricula || col.matricula.includes(filters.matricula);
      return nomeOk && matriculaOk;
    });
  }
}
