#include 'totvs.ch'

User Function CREDPOUI()
    fwCallApp("credito-guaraves-meu-bom-card")
Return 

Static Function jsToAdvpl(oWebChannel, cType, cContent)
	// cContent vem como JSON enviado pelo Angular
	Local oJsNovoC := JsonObject():New()

    do case 

        case cType == 'mensagemjs'
            // Exemplo de mensagem
            // oWebChannel:sendMessage({type: 'mensagemjs', content: 'Mensagem de teste'})
            fwAlertInfo(cContent, "Mensagem JS")
        
        case cType == 'mensagemProtheus'     
            oWebChannel:advplToJs('mensagemProtheus','Olá do Protheus!')

        case cType == 'loadZBCLibCore'
            cContent := fnLoadZBC()
            oWebChannel:advplToJs('loadZBCLibCore',cContent)

        case cType == 'salvarCredito'

			oJsNovoC:fromJson(cContent)
			// Retorno para o Angular
			If NovoCred(oJsNovoC)
				oWebChannel:advplToJs('salvarCredito', '{"status":"OK","mensagem":"Crédito inserido com sucesso no Protheus!"}')
			Else
				oWebChannel:advplToJs('salvarCredito', '{"status":"ERRO","mensagem":"Erro ao inserir crédito no Protheus."}')
			EndIf
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
    cCons+= "	ZBC_CIC,"
    cCons+= "	ZBC_USRCRE"
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
		oJsonZBC['cadastrado_por']	:= Alltrim(GETZBC->ZBC_USRCRE)
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

    While !ZBC->(EOF()) .And. ZBC->ZBC_FILIAL == cFilZBC .And. ZBC->ZBC_MATRIC == cMatZBC
		oJsonHist := JsonObject():New()
		oJsonHist['periodo']		:= ZBC->ZBC_PERIOD
		oJsonHist['valor_credito']	:= ZBC->ZBC_VALCRD
		oJsonHist['valor_saldo']	:= ZBC->ZBC_SALDO
		//
		nToSaldo+=ZBC->ZBC_SALDO
		//
		AAdd(aHists, oJsonHist)
        ZBC->(DbSkip())
    End
    AAdd(aDados, nToSaldo)
	AAdd(aDados, aHists)

Return aDados

Static Function NovoCred(oJson)

    Local cFila    	 := oJson['filial']
    Local cMatric    := oJson['matricula']
    Local cPeriodo   := oJson['periodo']
    //Local nValor     := Val(oJson['valorCredito'])
    //Local nSaldo     := Val(oJson['saldo'])
    Local lOk        := .T.
    // Inserir um novo registro em ZBC010
    DbSelectArea("ZBC")
	ZBC->(DbSetOrder(4))
	if ZBC->(DbSeek(cFila+cMatric+cPeriodo)) //SE EXISTIR EXIBIR MENSAGEM
	    // RecLock("ZBC",.F.)
	    //     //ZBC->ZBC_SALDO:= ZBC->ZBC_SALDO - nUsaCBC
	    //     If ZBC->ZBC_SALDO <= nValorRestante
	    //         nValorRestante -= ZBC->ZBC_SALDO
	    //         ZBC->ZBC_SALDO := 0
	    //     Else
	    //         ZBC->ZBC_SALDO := ZBC->ZBC_SALDO - nValorRestante
	    //         nValorRestante := 0
	    //     EndIf
	    // ZBC->(MsUnLock())
		lOk := .T.
	endif

Return lOk
