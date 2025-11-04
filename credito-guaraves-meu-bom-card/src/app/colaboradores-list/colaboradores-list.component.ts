import { Component } from '@angular/core';

@Component({
  selector: 'colaboradores-list',
  templateUrl: './colaboradores-list.component.html'
})
export class ColaboradoresListComponent {
    //VALORES MOCADOS
    colaboradores = [
    { matricula: '001', nome: 'João Silva', cargo: 'Analista', email: 'joao@empresa.com' },
    { matricula: '002', nome: 'Maria Souza', cargo: 'Gerente', email: 'maria@empresa.com' },
    { matricula: '003', nome: 'Carlos Lima', cargo: 'Assistente', email: 'carlos@empresa.com' },
    { matricula: '004', nome: 'Fernanda Oliveira', cargo: 'Coordenadora', email: 'fernanda@empresa.com' },
    { matricula: '005', nome: 'Pedro Lucas', cargo: 'Desenvolvedor', email: 'pedro@empresa.com' },
    { matricula: '006', nome: 'Ana Beatriz', cargo: 'Analista de RH', email: 'ana.beatriz@empresa.com' },
    { matricula: '007', nome: 'Ricardo Mendes', cargo: 'Supervisor', email: 'ricardo.mendes@empresa.com' },
    { matricula: '008', nome: 'Juliana Pereira', cargo: 'Gerente de Projetos', email: 'juliana.pereira@empresa.com' },
    { matricula: '009', nome: 'Tiago Costa', cargo: 'Desenvolvedor', email: 'tiago.costa@empresa.com' },
    { matricula: '010', nome: 'Sofia Almeida', cargo: 'Analista de Marketing', email: 'sofia.almeida@empresa.com' },
    // --- Geração automática até 200
    ...Array.from({ length: 190 }, (_, i) => {
        const num = (i + 11).toString().padStart(3, '0');
        const nomes = [
        'Lucas', 'Mariana', 'Gabriel', 'Camila', 'Felipe', 'Larissa', 'André', 'Paula', 'Rafael', 'Bianca',
        'Rodrigo', 'Isabela', 'Eduardo', 'Aline', 'Gustavo', 'Renata', 'Diego', 'Tatiane', 'Bruno', 'Priscila'
        ];
        const sobrenomes = [
        'Souza', 'Lima', 'Mendes', 'Alves', 'Ferreira', 'Rocha', 'Oliveira', 'Pereira', 'Costa', 'Santos'
        ];
        const cargos = [
        'Analista', 'Assistente', 'Desenvolvedor', 'Gerente', 'Coordenador', 'Supervisor', 'Engenheiro',
        'Técnico', 'Consultor', 'Estagiário'
        ];
        const nome = `${nomes[i % nomes.length]} ${sobrenomes[i % sobrenomes.length]}`;
        const cargo = cargos[i % cargos.length];
        const email = `${nome.toLowerCase().replace(/\s+/g, '.')}@empresa.com`;

        return { matricula: num, nome, cargo, email };
    })
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
