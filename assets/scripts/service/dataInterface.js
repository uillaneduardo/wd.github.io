//@ts-check
//Enum
const Slot = Object.freeze({ A: 0, B: 1, C: 2 });
const Pool = Object.freeze({ Diario: 'diario', Oferta: 'oferta' });

//Outros
const dadoEmCache = 'wd-recpes';
const caminhoDataAPI = 'https://api.wheeldone.playmarques.com';

//Origem dos dados
const dados = {
    perfil: {
        id: "akledas",
        caminhoImagem: 'nulo',
        nome: "usuário não encontrado",
        nivel: "?",
        moedas: 0,
        xp: 0
    },
    slots: {
        [Pool.Diario]: [
            {
                /*Slot Bloqueado*/
                nome: 'Slot Bloqueado', raridade: '', custo: 15,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: true, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-cadeado.png',
                caminhoCarta: 'images/silhueta-cadeado.png',
            },
            {
                /*Slot Bloqueado*/
                nome: 'Teste Slot', raridade: 'L', custo: 0,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: false, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-carro.png',
                caminhoCarta: 'images/card-carro.png',
            },
            {
                /*Slot Bloqueado*/
                nome: 'Slot Bloqueado', raridade: '', custo: 15,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: true, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-cadeado.png',
                caminhoCarta: 'images/silhueta-cadeado.png',
            }
        ],

        [Pool.Oferta]: [
            {
                /*Slot Bloqueado*/
                nome: 'Slot Bloqueado', raridade: '', custo: 10,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: true, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-cadeado.png',
                caminhoCarta: 'images/silhueta-cadeado.png',
            },
            {
                /*Slot Bloqueado*/
                nome: 'Slot Bloqueado', raridade: '', custo: 0,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: true, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-cadeado.png',
                caminhoCarta: 'images/silhueta-cadeado.png',
            },
            {
                /*Slot Bloqueado*/
                nome: 'Slot Bloqueado', raridade: '', custo: 10,
                descricao: 'Slot bloqueado temporariamente',
                bloqueado: true, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-cadeado.png',
                caminhoCarta: 'images/silhueta-cadeado.png',
            }
        ]
    },
    colecao: { //Coleção = lista de prêmios disponíveis na pool
        [Pool.Diario]: [
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icones/vazio.png', nome: 'Vazio', raridade: '', qtd: -1, clamado: false }
        ],
        [Pool.Oferta]: [/*Loja sem pool registrada*/]
    },
    conquistas: [
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista A', descricao: 'Primeira Conquista!', xp: 1, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista B', descricao: 'Segunda Conquista!', xp: 25, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista C', descricao: 'Terceira Conquista!', xp: 50, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista D', descricao: 'Quarta Conquista!', xp: 75, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conqusita E', descricao: 'Quinta Conquista!', xp: 100, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista F', descricao: 'Sexta Conquista!', xp: 150, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista G', descricao: 'Sétima Conquista!', xp: 200, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista H', descricao: 'Oitava Conquista!', xp: 250, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista I', descricao: 'Nona Conquista!', xp: 300, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista J', descricao: 'Décima Conquista!', xp: 400, clamado: false }
    ],
    inventario: [
        { caminhoIcone: '', nome: '', descricao: 'espaço para item' },
    ],
    ranking: {
        pessoal: [
            { id: '?', rank: '?1', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?2', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?3', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?4', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?5', nome: '?', nivel: '?', xp: 0 },
            { id: 'akledas', rank: '?6', nome: '?', nivel: '', xp: 0 },
            { id: '?', rank: '?7', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?8', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?9', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?10', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '?11', nome: '?', nivel: '?', xp: 0 }
        ],
        top10: [
            { id: '?', rank: '1', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '2', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '3', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '4', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '5', nome: '?', nivel: '?', xp: 0 },
            { id: '', rank: '6', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '7', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '8', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '9', nome: '?', nivel: '?', xp: 0 },
            { id: '?', rank: '10', nome: '?', nivel: '?', xp: 0 },
            { id: 'akledas', rank: '?', nome: 'você', nivel: '?', xp: 0 }
        ]
    }
}


//Funções Internas
function salvarCache(nome, dados) {
    localStorage.setItem(nome, JSON.stringify(dados));
}
function carregarCache(nome) {
    const cache = localStorage.getItem(nome);

    if (!cache) {
        console.log(`Arquivo ${nome} não encontrado armazenado no cache!`);
        return null;
    }

    try {
        return JSON.parse(cache);
    } catch {
        console.log("Erro ao tentar passar o cache para JSON");
        return null;
    }
}
function solicitarLogin(){
    const popupClasses = ['style-dark', 'style-sombra-adrenalina', 'style-rebelde-l'];
    const buttonClasses = 'bi bi-google btn-autoescola btn-sombra-adrenalina style-rebelde-r';
    const popupTitulo = 'Junte-se a nós!';
    const paragrafo = 'Faça login para participar do evento. Se você é beta, entre com o mesmo email que tem o acesso ao beta.';
    const imagemCaminho = '../assets/images/elen-login.png';
    const imagemBalaoDescricao = 'Não se preocupe, vai dar tudo certo. Quando você entrar, eu irei colocar seu nome aqui na lista.';
    const authStartUrl = `window.location.assign('${caminhoDataAPI}/auth/google/start')`;
    const popupConteudo = `
        <p>${paragrafo}</p>
        <div style="display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px; margin-top: 10px;">
            <button class="${buttonClasses}" onclick="${authStartUrl}"> Entrar com o google</button>
            <img src="${imagemCaminho}" alt="Elen com uma prancheta" data-balao="${imagemBalaoDescricao}" class="balao"/>
        </div>
    `;

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses, allowClosing: false});

}

async function buscarDadosPerfil() {
  const dadosUsuario = await fazerRequisicao('/user/me');
  const moedas = await fazerRequisicao('/tickets/balance');
  const xp = await fazerRequisicao('/user/xp');
  const nivel = await fazerRequisicao('/user/level');

  dados.perfil.id = dadosUsuario?.id ?? dados.perfil.id;
  dados.perfil.caminhoImagem = dadosUsuario?.picture_url ?? dados.perfil.caminhoImagem;
  dados.perfil.nome = dadosUsuario?.name ?? dados.perfil.nome;
  dados.perfil.nivel = nivel?.level ?? dados.perfil.nivel;
  dados.perfil.moedas = moedas?.balance ?? dados.perfil.moedas;
  dados.perfil.xp = xp?.xp ?? dados.perfil.xp;

}

async function fazerRequisicao(rota, metodo = 'GET', corpo = null) {
  const headers = { Accept: 'application/json' };
  if (corpo && metodo !== 'GET') headers['Content-Type'] = 'application/json';

  try {
    const resposta = await fetch(caminhoDataAPI + rota, {
      method: metodo,
      credentials: 'include',
      headers,
      ...(corpo ? { body: JSON.stringify(corpo) } : {})
    });

    if (resposta.status === 401) {
      solicitarLogin();
      return null;
    }
    if (resposta.status === 204) return null;

    if (!resposta.ok){
        throw new Error(`HTTP ${resposta.status}`);
    }

    return await resposta.json();
  } catch (err) {
    console.error('Erro na requisição', err);
    return null;
  }
}



//Assinatura pública
export const Server = {
    Slot, Pool,
    conectar: buscarDados,
    desconectar: excluirDados,
    perfil: criarPerfil,
    card: criarSlot,
    colecao: criarColecao,
    progresso: criarProgresso,
    inventario: criarInventario,
    ranking: criarRanking
};

async function buscarDados() {
    await buscarDadosPerfil();
}
async function excluirDados(){
    fazerRequisicao('/auth/logout/all', 'POST');
}
function criarPerfil() {
    return Object.freeze({
        qualID() { return dados?.perfil?.id;},
        qualUrlImagem() { return `url('${dados?.perfil?.caminhoImagem}')`;},
        qualNome() { return dados?.perfil?.nome; },
        qualNivel() { return dados?.perfil?.nivel; },
        quantasMoedas() { return dados?.perfil?.moedas; },
        quantoXp() { return dados?.perfil?.xp; }

    })
}
function criarSlot(pool, slot) {
    //Interface do Slot
    return Object.freeze({
        // Leitura Dados
        qualNome() { return dados?.slots[pool]?.[slot]?.nome; },
        qualDescricao() { return dados?.slots[pool]?.[slot]?.descricao; },

        foiBloqueado() { return dados?.slots[pool]?.[slot]?.bloqueado; },
        foiRevelado() { return dados?.slots[pool]?.[slot]?.revelado; },
        foiComprado() { return dados?.slots[pool]?.[slot]?.clamado; },

        qualCaminhoIcone(relativo = './') {return relativo + (dados?.slots[pool]?.[slot]?.caminhoIcone);},
        qualCaminhoCarta(relativo = './') {return relativo + (dados?.slots[pool]?.[slot]?.caminhoCarta);},
        qualCaminhoMascara(relativo = './') {return relativo + (dados?.slots[pool]?.[slot]?.caminhoMascara);},

        qualRaridade() { return dados?.slots[pool]?.[slot]?.raridade; },
        qualCusto() { return dados?.slots[pool]?.[slot]?.custo; },

        // Formatação dos dados
        qualUrlIcone(relativo = './') { return `url('${this.qualCaminhoIcone(relativo)}')` },
        qualUrlCarta(relativo = './') { return `url('${this.qualCaminhoCarta(relativo)}')` },

        pegarRaridadeFormatada() {
            if (this.foiBloqueado()) return '';
            const raridade = this.qualRaridade();
            switch (raridade) {
                case 'C': return 'Comum';
                case 'R': return 'Raro';
                case 'E': return 'Épico';
                case 'L': return 'Limitado';
            }
        },
        qualCorRaridade() {
            if (this.foiBloqueado()) return 'var(--cor-predominante)';
            const raridade = this.qualRaridade();
            switch (raridade) {
                case 'C': return 'var(--cor-liberdade)';
                case 'R': return 'var(--cor-autoescola)';
                case 'E': return 'var(--cor-adrenalina)';
                case 'L': return 'var(--cor-limitada)';
            }
        },

        pegarCustoFormatado() {
            if (this.foiComprado()) return 'Obtido'
            if (this.qualCusto() > 0) return this.qualCusto();
            else return 'Grátis';
        },


        // Escrita
        revelar() { dados.slots[pool][slot].revelado = true; return true; },
        comprar() { dados.slots[pool][slot].clamado = true; return true; },

    });
}
function criarColecao(pool) {
    //Interface da Coleção
    return Object.freeze({
        //Leitura
        tamanho() { return dados?.colecao[pool]?.length ?? 0; },
        qualCaminhoIcone(indice, relativo = './') { return relativo + (dados?.colecao[pool]?.[indice]?.caminhoIcone); },
        qualNome(indice) { return dados?.colecao[pool]?.[indice]?.nome; },
        qualRaridade(indice) { return dados?.colecao[pool]?.[indice]?.raridade; },
        foiComprado(indice) { return dados?.colecao[pool]?.[indice]?.clamado; },


        pegarRaridadeFormatada(indice) {
            const raridade = this.qualRaridade(indice);
            switch (raridade) {
                case 'C': return 'Comum';
                case 'R': return 'Raro';
                case 'E': return 'Épico';
                case 'L': return 'Limitado';
            }
        },
        qualProbabilidade(indice) {
            const raridade = this.qualRaridade(indice);
            const raridades = { C: 0.60, R: 0.30, E: 0.09, L: 0.01 };

            // conta quantos itens há de cada tipo
            const contagem = { C: 0, R: 0, E: 0, L: 0 };
            for (const item of dados?.colecao[pool] ?? []) {
                contagem[item.raridade] = (contagem[item.raridade] ?? 0) + 1;
            }

            const valor = (raridades[raridade] ?? 0) / (contagem[raridade] || 1);
            const truncado = Math.trunc(valor * 10000) / 100;
            return truncado.toFixed(2).replace('.', ',') + '%';
        }
    })
}
function criarProgresso() {
    return Object.freeze({
        //Leitura
        quantidadeXP() { return dados?.perfil?.xp; },
        conquistaTamanho() { return dados?.conquistas?.length ?? 0; },
        conquistaCaminhoIcone(indice, relativo) { return relativo + (dados?.conquistas[indice]?.caminhoIcone); },
        conquistaNome(indice) { return dados?.conquistas[indice]?.nome; },
        conquistaDescricao(indice) { return dados?.conquistas[indice]?.descricao; },
        conquistaRequisitoXP(indice) { return dados?.conquistas[indice]?.xp; },
        conquistaClamada(indice) { return dados?.conquistas[indice]?.clamado; },

        conquistasResumidas() {
            const n = this.conquistaTamanho();
            if (n <= 3) return dados?.conquistas?.slice(0, n);

            const xp = this.quantidadeXP();

            // Alvo = primeira conquista cujo requisito é MAIOR que o XP atual
            // (se for igual, já está conquistada; o alvo é a próxima)
            let alvo = -1;
            for (let i = 0; i < n; i++) {
                if (xp < this.conquistaRequisitoXP(i)) {
                    alvo = i;
                    break;
                }
            }

            // Se todas já foram conquistadas, pegue as 3 últimas
            if (alvo === -1) {
                const start = n - 3;
                return dados?.conquistas?.slice(start, n);
            }

            // Monte janela de 3 itens em torno do alvo
            // - se alvo = 0 → [0,1,2]
            // - se alvo = n-1 → [n-3,n-2,n-1]
            // - caso geral → [alvo-1, alvo, alvo+1]
            let start;
            if (alvo === 0) {
                start = 0;
            } else if (alvo === n - 1) {
                start = n - 3;
            } else {
                start = alvo - 1;
            }

            return dados?.conquistas?.slice(start, start + 3);
        }

    })
}
function criarInventario() {
    return Object.freeze({
        tamanho() { return dados?.inventario?.length ?? 0; },
        caminhoIcone(indice, relativo = './') { return relativo + (dados?.inventario[indice]?.caminhoIcone); },
        qualNome(indice) { return dados?.inventario[indice]?.nome; },
        qualDescricao(indice) { return dados?.inventario[indice]?.descricao; },

        qualUrlIcone(indice, relativo = './') { return `url('${this.caminhoIcone(indice, relativo)}')`; }
    })
}
function criarRanking() {
    return Object.freeze({
        top10() { return dados?.ranking?.top10; },
        pessoal() { return dados?.ranking?.pessoal; }
    })
}
