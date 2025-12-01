import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NovoColaboradorService {

    // 🟢 MÉTODO MOCK — simula retorno
    aguardarRetornoNovoColaboradorMock(payload: any): Promise<any> {
        return new Promise(resolve => {

            setTimeout(() => {

                // 🔥 SIMULAÇÕES BASEADAS NOS CAMPOS DO PAYLOAD
                const { filial, matricula } = payload;

                // ➤ 1) Colaborador não encontrado
                if (!filial || !matricula) {
                    return resolve({
                        code: 404,
                        status: "ERRO",
                        mensagem: "Colaborador Não encontrado no cadastro SRA, verifique filial e matrícula(Mock)"
                    });
                }

                // ➤ 2) Já existe no cadastro
                if (matricula === "99999") { // você pode alterar a regra que define conflito
                    return resolve({
                        code: 409,
                        status: "ERRO",
                        mensagem: "Colaborador Já existe no cadastro de crédido(Mock)"
                    });
                }

                // ➤ 3) Inserido com sucesso
                return resolve({
                    code: 201,
                    status: "OK",
                    mensagem: "Colaborador inserido com sucesso no Protheus!(Mock)"
                });

            }, 1500);

        });
    }

}