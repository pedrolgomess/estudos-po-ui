#include 'totvs.ch'

User Function CREDPOUI()
    fwCallApp("credito-guaraves-meu-bom-card")
Return 

Static Function jsToAdvpl(oWebChannel, cType, cContent)
	// cContent vem como JSON enviado pelo Angular
	Local oJsNovoC 	:= JsonObject():New()
	Local oJsRetNo	:= JsonObject():New()
	Local oJsEdit	:= JsonObject():New()
	Local cListaAtualizada := ''

    do case 

        case cType == 'loadZBCLibCore'

            cContent := fnLoadZBC()
            oWebChannel:advplToJs('loadZBCLibCore',cContent)

        case cType == 'salvarCredito'

			//Recebendo conteudo do Json passando para fromJson
			oJsNovoC:fromJson(cContent)

			// Executa a função
			oJsRetNo:= NovoCred(oJsNovoC)
			
			// Retorno para o Angular
			Do Case
			Case oJsRetNo['code'] == 201
				oWebChannel:advplToJs('salvarCredito', oJsRetNo:toJson())
				// ?? AGORA DEVOLVE A LISTA ZBC ATUALIZADA
				cListaAtualizada := fnLoadZBC()
				oWebChannel:advplToJs('loadZBCLibCore', cListaAtualizada)

			Case oJsRetNo['code'] == 422
				oWebChannel:advplToJs('salvarCredito', oJsRetNo:toJson())

			Case oJsRetNo['code'] == 409
				oWebChannel:advplToJs('salvarCredito', oJsRetNo:toJson())

			EndCase

		case cType == 'novoColaborador'

			//Recebendo conteudo do Json passando para fromJson
			oJsNovoC:fromJson(cContent)

			// Executa a função
			oJsRetNo:= NovoCola(oJsNovoC)
			
			// Retorno para o Angular
			Do Case
			Case oJsRetNo['code'] == 201
				oWebChannel:advplToJs('novoColaborador', oJsRetNo:toJson())
				// ?? AGORA DEVOLVE A LISTA ZBC ATUALIZADA
				cListaAtualizada := fnLoadZBC()
				oWebChannel:advplToJs('loadZBCLibCore', cListaAtualizada)

			Case oJsRetNo['code'] == 422
				oWebChannel:advplToJs('novoColaborador', oJsRetNo:toJson())

			Case oJsRetNo['code'] == 404
				oWebChannel:advplToJs('novoColaborador', oJsRetNo:toJson())

			Case oJsRetNo['code'] == 409
				oWebChannel:advplToJs('novoColaborador', oJsRetNo:toJson())

			EndCase
			
		case cType == 'editarPeriodo'

			//Recebendo conteudo do Json passando para fromJson
			oJsEdit:fromJson(cContent)

			// Executa a função
			oJsRetNo:= EditPeri(oJsEdit)

			// Retorno para o Angular
			Do Case
			Case oJsRetNo['code'] == 201
				oWebChannel:advplToJs('editarPeriodo', oJsRetNo:toJson())
				// ?? AGORA DEVOLVE A LISTA ZBC ATUALIZADA
				cListaAtualizada := fnLoadZBC()
				oWebChannel:advplToJs('loadZBCLibCore', cListaAtualizada)

			Case oJsRetNo['code'] == 422
				oWebChannel:advplToJs('editarPeriodo', oJsRetNo:toJson())

			EndCase
		
		case cType == 'excluirPeriodo'

			//Recebendo conteudo do Json passando para fromJson
			oJsEdit:fromJson(cContent)

			// Executa a função
			oJsRetNo:= ExclPeri(oJsEdit)

			// Retorno para o Angular
			Do Case

			Case oJsRetNo['code'] == 201
				oWebChannel:advplToJs('excluirPeriodo', oJsRetNo:toJson())
				// ?? AGORA DEVOLVE A LISTA ZBC ATUALIZADA
				cListaAtualizada := fnLoadZBC()
				oWebChannel:advplToJs('loadZBCLibCore', cListaAtualizada)
			EndCase
    end case
    
Return .T.


Static Function fnLoadZBC()

    Local cListOpsStr := ''
	Local oJsonOut 	:= JsonObject():New()
	Local oJsonZBC 	:= Nil
	Local cCons		:= ''
	Local allColab	:= {}
	Local aRets		:= {}
	cCons+= "SELECT "
    cCons+= "DISTINCT"
    cCons+= "	ZBC_FILIAL,"
    cCons+= "	ZBC_MATRIC,"
    cCons+= "	ZBC_CLIENT,"
    cCons+= "	ZBC_LOJA,"
    cCons+= "	ZBC_CIC"
	cCons+= "FROM "
	cCons+= " PROTHEUS.ZBC010"
	cCons+= "WHERE "
	cCons+=" D_E_L_E_T_ = ' '"
	cCons+= "ORDER BY"
	cCons+=" ZBC_FILIAL, ZBC_MATRIC"

	cCons:= ChangeQuery(cCons)

	DbUseArea(.T., "TOPCONN", TCGenQry(,,cCons), 'GETZBC', .F., .T.)
    GETZBC->(dbGoTop())

    while GETZBC->(!EOF())
		aRets:= xGetHis(GETZBC->ZBC_FILIAL, GETZBC->ZBC_MATRIC)
        // Preenchendo as variaveis do cabeçalho
		oJsonZBC := JsonObject():New()
		oJsonZBC['filial']			:= GETZBC->ZBC_FILIAL
		oJsonZBC['matricula']		:= GETZBC->ZBC_MATRIC
		oJsonZBC['client']			:= GETZBC->ZBC_CLIENT
		oJsonZBC['loja']			:= GETZBC->ZBC_LOJA
		oJsonZBC['cpf']				:= GETZBC->ZBC_CIC
		oJsonZBC['nome']			:= Alltrim(POSICIONE("SA1",3,xFilial("SA1")+GETZBC->ZBC_CIC, "A1_NOME"))
		oJsonZBC['saldo_total']		:= aRets[1]
		oJsonZBC['historico']		:= aRets[2]
		AAdd(allColab, oJsonZBC)
        GETZBC->(DbSkip())
    end
    GETZBC->(DbCloseArea())

    oJsonOut:set(allColab)

    cListOpsStr := oJsonOut:toJson()
    
Return cListOpsStr

Static Function xGetHis(cFilZBC, cMatZBC)
	Local aDados	:= {}
	Local aHists	:= {}
	Local oJsonHist := Nil
	Local nToSaldo	:= 0

	DbSelectArea("ZBC")
	ZBC->(dbSetOrder(1))
    if ZBC->(DbSeek(cFilZBC+cMatZBC))
    
        While !ZBC->(EOF()) .And. ZBC->ZBC_FILIAL == cFilZBC .And. ZBC->ZBC_MATRIC == cMatZBC
            oJsonHist := JsonObject():New()
            oJsonHist['periodo']		:= ZBC->ZBC_PERIOD
            oJsonHist['valor_credito']	:= ZBC->ZBC_VALCRD
            oJsonHist['valor_saldo']	:= ZBC->ZBC_SALDO
			oJsonHist['periodo_atual']	:= IIF(ZBC->ZBC_PERIOD == xretAtua(), .T., .F.)
            //
            nToSaldo+=ZBC->ZBC_SALDO
            //
            AAdd(aHists, oJsonHist)
            ZBC->(DbSkip())
        End
    endif
    AAdd(aDados, nToSaldo)
	AAdd(aDados, aHists)

Return aDados

Static Function NovoCred(oJson)

    Local cFila    	 := oJson['filial']
    Local cMatric    := oJson['matricula']
    Local cPeriodo   := oJson['periodo']
	Local cPerAtua	 := xretAtua()
	Local oJsRet	:= JsonObject():New()

    DbSelectArea("ZBC")
	ZBC->(DbSetOrder(4))
	
	// 1° Condição para validar o período
	if Alltrim(cPeriodo) != Alltrim(cPerAtua)
		oJsRet['code']		:= 422
		oJsRet['status']	:= "ERRO"
		oJsRet['mensagem']	:= "O período inserido: "+cPeriodo+ " é diferente do período atual: "+ cPerAtua
		Return oJsRet
	endif
	
	// 2° Condição para na ZBC
	if ZBC->(DbSeek(cFila+cMatric+cPeriodo)) //SE EXISTIR EXIBIR MENSAGEM QUE O PERÍODO JÁ FOI CRIADO

		oJsRet['code']		:= 409
		oJsRet['status']	:= "ERRO"
		oJsRet['mensagem']	:= "Já Existe este crédito neste período"
		Return oJsRet
	else
		RecLock("ZBC",.T.)
			ZBC->ZBC_FILIAL:= cFila
			ZBC->ZBC_MATRIC:= cMatric
			ZBC->ZBC_CLIENT:= oJson['client']
			ZBC->ZBC_LOJA  := oJson['loja']
			ZBC->ZBC_CIC   := oJson['cpf']
			ZBC->ZBC_VALCRD:= oJson['valorCredito']
			ZBC->ZBC_PERIOD:= cPeriodo
			ZBC->ZBC_SALDO := oJson['saldo']
			ZBC->ZBC_USRCRE:= CUSERNAME
		ZBC->(MsUnLock())

		oJsRet['code']		:= 201
		oJsRet['status']	:= "OK"
		oJsRet['mensagem']	:= "Crédito inserido com sucesso no Protheus!"
		Return oJsRet
		
	endif

Return lOk

Static Function NovoCola(oJson)
    Local cFila    	:= oJson['filial']
    Local cMatric   := oJson['matricula']
	Local cPeriodo	:= oJson['periodo']
	Local cPerAtua	 := xretAtua()
    Local oJsRet	:= JsonObject():New()
	Local cCpf		:= ''

	// 1° Condição para validar o período
	if Alltrim(cPeriodo) != Alltrim(cPerAtua)
		oJsRet['code']		:= 422
		oJsRet['status']	:= "ERRO"
		oJsRet['mensagem']	:= "O período inserido: "+cPeriodo+ " é diferente do período atual: "+ cPerAtua
		Return oJsRet
	endif

	// Etapa para buscar Na SRA e verificar se existe o colaborador dentro do Protheus
	DbSelectArea("SRA")
	SRA->(DbSetOrder(1))
	if !SRA->(DbSeek(cFila+cMatric))

		oJsRet['code']		:= 404
		oJsRet['status']	:= "ERRO"
		oJsRet['mensagem']	:= "Colaborador Não encontrado no cadastro SRA, verifique filial e matrícula"
		Return oJsRet

	else

		DbSelectArea("ZBC")
		ZBC->(DbSetOrder(1))
		if ZBC->(DbSeek(cFila+cMatric)) //SE EXISTIR EXIBIR MENSAGEM QUE O PERÍODO JÁ FOI CRIADO

			oJsRet['code']		:= 409
			oJsRet['status']	:= "ERRO"
			oJsRet['mensagem']	:= "Colaborador Já existe no cadastro de crédido"
			Return oJsRet

		else
			cCpf:= POSICIONE("SRA",1,cFila+cMatric,"RA_CIC")
			
			RecLock("ZBC",.T.)
				ZBC_FILIAL	:= 	cFila
				ZBC_MATRIC	:= 	cMatric
				ZBC_CLIENT	:= 	POSICIONE("SA1",3,xFilial("SA1")+cCpf,"A1_COD")
				ZBC_LOJA  	:=	POSICIONE("SA1",3,xFilial("SA1")+cCpf,"A1_LOJA")
				ZBC_CIC   	:=	cCpf
				ZBC_VALCRD	:=	oJson['valorCredito']
				ZBC_PERIOD	:=	cPeriodo
				ZBC_SALDO 	:=	oJson['saldo']
				ZBC_USRCRE	:=	CUSERNAME
				ZBC_NOME  	:=	POSICIONE("SA1",3,xFilial("SA1")+cCpf,"A1_NOME")
			ZBC->(MsUnLock())

			oJsRet['code']		:= 201
			oJsRet['status']	:= "OK"
			oJsRet['mensagem']	:= "Colaborador inserido com sucesso no Protheus!"
			Return oJsRet

		endif

	endif

Return

Static Function xretAtua()

    Local cAno  := ""
    Local cMes  := ""

    // --- Calcula o mês anterior ---
    If Month(dDataBase) == 1
        // Janeiro ? volta para Dezembro do ano anterior
        cAno := cValToChar( Year(dDataBase) - 1 )
        cMes := "12"
    Else
        // Apenas retorna o mês anterior dentro do mesmo ano
        cAno := cValToChar( Year(dDataBase ) )
        cMes := StrZero( Month(dDataBase) - 1 , 2 )
    EndIf

Return cMes+cAno

Static Function EditPeri(oJson)

    Local cFila    	 := oJson['filial']
    Local cMatric    := oJson['matricula']
    Local cPeriodo   := oJson['periodo']
	Local cPerAtua	 := xretAtua()
	Local oJsRet	 := JsonObject():New()
	
	// 1° Condição para validar o período
	if Alltrim(cPeriodo) != Alltrim(cPerAtua)
		oJsRet['code']		:= 422
		oJsRet['status']	:= "ERRO"
		oJsRet['mensagem']	:= "O período inserido: "+cPeriodo+ " é diferente do período atual: "+ cPerAtua
		Return oJsRet
	endif

	// Inserir um novo registro em ZBC010
    DbSelectArea("ZBC")
	ZBC->(DbSetOrder(4))
	if ZBC->(DbSeek(cFila+cMatric+cPeriodo)) //Alterando o período atual
		RecLock("ZBC",.F.)
			ZBC->ZBC_VALCRD:= oJson['valorCredito']
			ZBC->ZBC_SALDO := oJson['saldo']
			ZBC->ZBC_USRCRE:= CUSERNAME
		ZBC->(MsUnLock())

		oJsRet['code']		:= 201
		oJsRet['status']	:= "OK"
		oJsRet['mensagem']	:= "Crédito inserido com sucesso no Protheus!"
		Return oJsRet

	endif
Return

Static Function ExclPeri(oJson)

	Local cFila    	 := oJson['filial']
    Local cMatric    := oJson['matricula']
    Local cPeriodo   := oJson['periodo']
	Local oJsRet	 := JsonObject():New()
	
	// Inserir um novo registro em ZBC010
    DbSelectArea("ZBC")
	ZBC->(DbSetOrder(4))
	if ZBC->(DbSeek(cFila+cMatric+cPeriodo)) //Alterando o período atual

		RecLock("ZBC",.F.)
			ZBC->(DbDelete())
		ZBC->(MsUnLock())

		oJsRet['code']		:= 201
		oJsRet['status']	:= "OK"
		oJsRet['mensagem']	:= "Período excluído com sucesso no Protheus!"
		Return oJsRet

	endif

Return
