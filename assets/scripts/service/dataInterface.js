//Enum
const Slot = Object.freeze({ A: 0, B: 1, C: 2 });
const Pool = Object.freeze({ Diario: 'diario', Oferta: 'oferta' });

//Outros
const dadoEmCache = 'wd-recpes';
const caminhoDataAPI = 'https://api.wheeldone.playmarques.com';

//Origem dos dados
let dados = {
    perfil: {
        id: "akledas",
        nome: "Gilmar Santos",
        nivel: "habilitado",
        moedas: 550,
        xp: 110
    },
    slots: {
        [Pool.Diario]: [
            {/*Slot Bloqueado*/ },
            {
                nome: 'EMIS Persona', raridade: 'E', custo: 0,
                descricao: 'Carro clássico inspirado no Opala SS e no Maverick',
                bloqueado: false, revelado: false, clamado: false,
                caminhoIcone: 'images/icone-carro.png',
                caminhoCarta: 'images/card-carro.png',
                caminhoMascara: 'images/silhueta-carro.png'
            },
            {/*Slot Bloqueado*/ }
        ],

        [Pool.Oferta]: [
            {/*Slot Bloqueado*/ },
            {/*Slot Bloqueado*/ },
            {/*Slot Bloqueado*/ }
        ]
    },
    colecao: { //Coleção = lista de prêmios disponíveis na pool
        [Pool.Diario]: [
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'C', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'R', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'R', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'R', qtd: -1, clamado: true },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'R', qtd: -1, clamado: false },
            { caminhoIcone: 'images/icone-carro.png', nome: 'EMIS Persona', raridade: 'E', qtd: -1, clamado: false }
        ],
        [Pool.Oferta]: [/*Loja sem pool registrada*/]
    },
    conquistas: [
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Recém Habilitado', descricao: 'Primeira Conquista!', xp: 1, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista B', descricao: 'Segunda Conquista!', xp: 25, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista C', descricao: 'Terceira Conquista!', xp: 50, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista D', descricao: 'Quarta Conquista!', xp: 75, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Habilitado', descricao: 'Quinta Conquista!', xp: 100, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista F', descricao: 'Sexta Conquista!', xp: 150, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista G', descricao: 'Sétima Conquista!', xp: 200, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista H', descricao: 'Oitava Conquista!', xp: 250, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Beta PPD', descricao: 'Nona Conquista!', xp: 300, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', nome: 'Conquista J', descricao: 'Décima Conquista!', xp: 400, clamado: false }
    ],
    inventario: [
        { caminhoIcone: 'images/icones/inventario.png', nome: 'Item A', descricao: 'Um item aleatório para testar o inventário' },
        { caminhoIcone: 'images/icones/inventario.png', nome: 'Item B', descricao: 'Um item aleatório para testar o inventário' },
        { caminhoIcone: 'images/icones/inventario.png', nome: 'Item C', descricao: 'Um item aleatório para testar o inventário' },
        { caminhoIcone: 'images/icones/inventario.png', nome: 'Item D', descricao: 'Um item aleatório para testar o inventário' },
        { caminhoIcone: 'images/icones/inventario.png', nome: 'Item E', descricao: 'Um item aleatório para testar o inventário' }
    ],
    ranking: {
        pessoal: [
            { id: '', rank: '2835', nome: 'Bryan', nivel: 'Habilitado', xp: 80 },
            { id: '', rank: '2834', nome: 'Matheus', nivel: 'Habilitado', xp: 77 },
            { id: '', rank: '2833', nome: 'Enzo', nivel: 'Habilitado', xp: 73 },
            { id: '', rank: '2832', nome: 'Fernando', nivel: 'Habilitado', xp: 73 },
            { id: '', rank: '2831', nome: 'Jadeilson', nivel: 'Habilitado', xp: 72 },
            { id: 'akledas', rank: '2830', nome: 'Gilmar Santos', nivel: 'Habilitado', xp: 70 },
            { id: '', rank: '2829', nome: 'Eitor', nivel: 'Habilitado', xp: 67 },
            { id: '', rank: '2828', nome: 'Otávio', nivel: 'Habilitado', xp: 67 },
            { id: '', rank: '2827', nome: 'Mariana', nivel: 'Habilitado', xp: 63 },
            { id: '', rank: '2826', nome: 'Júlio', nivel: 'Habilitado', xp: 62 },
            { id: '', rank: '2825', nome: 'Vanessa', nivel: 'Habilitado', xp: 60 }
        ],
        top10: [
            { id: '', rank: '1', nome: 'Primeiro', nivel: 'Magnata', xp: 2490 },
            { id: '', rank: '2', nome: 'Segundo', nivel: 'Magnata', xp: 2110 },
            { id: '', rank: '3', nome: 'Terceiro', nivel: 'Astro', xp: 1845 },
            { id: '', rank: '4', nome: 'Quarto', nivel: 'Astro', xp: 1550 },
            { id: '', rank: '5', nome: 'Quinto', nivel: 'Astro', xp: 1510 },
            { id: '', rank: '6', nome: 'Sexto', nivel: 'Astro', xp: 1480 },
            { id: '', rank: '7', nome: 'Sétimo', nivel: 'Astro', xp: 1410 },
            { id: '', rank: '8', nome: 'Oitavo', nivel: 'Astro', xp: 1385 },
            { id: '', rank: '9', nome: 'Nono', nivel: 'Astro', xp: 1380 },
            { id: '', rank: '10', nome: 'Décimo', nivel: 'Astro', xp: 1270 },
            { id: 'akledas', rank: '2830', nome: 'você', nivel: 'Habilitado', xp: 70 }
        ]
    }
}

let dados_perfil =  {
        id: " ",
        caminhoImagem: " ",
        nome: " ",
        nivel: " ",
        moedas: 0,
        xp: 0
    };
let dados_slot = {};
let dados_colecao = {};
let dados_conquistas = [];
let dados_inventario = [];
let dados_ranking_top10 = [];
let dados_ranking_pessoal = [];


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

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses });

}

async function buscarDadosPerfil(){
    const dadosUsuario = await fazerRequisicao('/user/me');
    //const xp = await fazerRequisicao('/user/xp');
    //const moedas = await fazerRequisicao('/user/tickets');

    dados_perfil = {
        id: dadosUsuario.id,
        caminhoImagem: dadosUsuario.picture_url,
        nome: dadosUsuario.nome,
        nivel: 'Testando',
        moedas: 0,
        xp: 0
    }
}

async function fazerRequisicao(rota, metodo = 'GET', corpo = null){
    const resposta = await fetch(caminhoDataAPI + rota,
        {
            method: metodo,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: corpo ? JSON.stringify(corpo) : null
        });

    if(resposta.status === 200){
        //conexão bem sucedida, retornando dados
        return await resposta.json();
    }

    if(resposta.status === 401){
        //não autenticado
        solicitarLogin();
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
    fazerRequisicao('/auth/logout', 'POST');
}
function criarPerfil() {
    return Object.freeze({
        qualID() { return dados_perfil?.id ?? ''; },
        qualUrlImagem() { return dados_perfil?.caminhoImagem ?? ''; },
        qualNome() { return dados_perfil?.nome ?? 'Não encontrado'; },
        qualNivel() { return dados_perfil?.nivel ?? 'Recém Habilitado'; },
        quantasMoedas() { return dados_perfil?.moedas ?? 0.0; },
        quantoXp() { return dados_perfil?.xp ?? 0; }

    })
}
function criarSlot(pool, slot) {
    //Interface do Slot
    return Object.freeze({
        // Leitura Dados
        qualNome() { return dados_slot[pool]?.[slot]?.nome ?? 'Slot Bloqueado'; },
        qualDescricao() { return dados_slot[pool]?.[slot]?.descricao ?? 'Este slot está bloqueado'; },

        foiBloqueado() { return dados_slot[pool]?.[slot]?.bloqueado ?? true; },
        foiRevelado() { return dados_slot[pool]?.[slot]?.revelado ?? false; },
        foiComprado() { return dados_slot[pool]?.[slot]?.clamado ?? false; },

        qualCaminhoIcone(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoIcone ?? 'images/icone-cadeado.png');
        },
        qualCaminhoCarta(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoCarta ?? 'images/silhueta-cadeado.png');
        },
        qualCaminhoMascara(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoMascara ?? 'images/silhueta-cadeado.png');
        },

        qualRaridade() { return dados_slot[pool]?.[slot]?.raridade ?? ''; },
        qualCusto() { return dados_slot[pool]?.[slot]?.custo ?? 0; },

        // Formatação dos dados
        qualUrlIcone(relativo = './') { return `url('${this.qualCaminhoIcone(relativo)}')` },
        qualUrlCarta(relativo = './') { return `url('${this.qualCaminhoCarta(relativo)}')` },
        qualUrlMascara(relativo = './') { return `url('${this.qualCaminhoMascara(relativo)}')` },
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
        revelar() { dados_slot[pool][slot].revelado = true; return true; },
        comprar() { dados_slot[pool][slot].clamado = true; return true; },

    });
}
function criarColecao(pool) {
    //Interface da Coleção
    return Object.freeze({
        //Leitura
        tamanho() { return dados_colecao[pool]?.length ?? 0; },
        qualCaminhoIcone(indice, relativo = './') { return relativo + (dados_colecao[pool]?.[indice]?.caminhoIcone ?? ''); },
        qualNome(indice) { return dados_colecao[pool]?.[indice]?.nome ?? ''; },
        qualRaridade(indice) { return dados_colecao[pool]?.[indice]?.raridade ?? ''; },
        pegarRaridadeFormatada(indice) {
            const raridade = this.qualRaridade(indice);
            switch (raridade) {
                case 'C': return 'Comum';
                case 'R': return 'Raro';
                case 'E': return 'Épico';
                case 'L': return 'Limitado';
            }
        },
        foiComprado(indice) { return dados_colecao[pool]?.[indice]?.clamado ?? false; },
        qualProbabilidade(indice) {
            const raridade = this.qualRaridade(indice);
            const raridades = { C: 0.60, R: 0.30, E: 0.09, L: 0.01 };

            // conta quantos itens há de cada tipo
            const contagem = { C: 0, R: 0, E: 0, L: 0 };
            for (const item of dados_colecao[pool] ?? []) {
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
        quantidadeXP() { return dados_perfil?.xp ?? 0; },
        conquistaTamanho() { return dados_conquistas?.length ?? 0; },
        conquistaCaminhoIcone(indice, relativo) { return relativo + (dados_conquistas[indice]?.caminhoIcone ?? ''); },
        conquistaNome(indice) { return dados_conquistas[indice]?.nome ?? 'Error'; },
        conquistaDescricao(indice) { return dados_conquistas[indice]?.descricao ?? 'Não encontrado' },
        conquistaRequisitoXP(indice) { return dados_conquistas[indice]?.xp ?? '0'; },
        conquistaClamada(indice) { return dados_conquistas[indice]?.clamado ?? false; },
        conquistasResumidas() {
            const n = this.conquistaTamanho();
            if (n <= 3) return dados_conquistas?.slice(0, n);

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
                return dados_conquistas?.slice(start, n);
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

            return dados_conquistas?.slice(start, start + 3);
        }

    })
}
function criarInventario() {
    return Object.freeze({
        tamanho() { return dados_inventario.length; },
        caminhoIcone(indice, relativo = './') { return relativo + (dados_inventario[indice]?.caminhoIcone ?? ''); },
        qualNome(indice) { return dados_inventario[indice]?.nome ?? 'Error'; },
        qualDescricao(indice) { return dados_inventario[indice]?.descricao ?? 'Ocorreu um problema'; },

        qualUrlIcone(indice, relativo = './') { return `url('${this.caminhoIcone(indice, relativo)}')`; }
    })
}
function criarRanking() {
    return Object.freeze({
        top10() { return dados_ranking_top10; },
        pessoal() { return dados_ranking_pessoal; }
    })
}
