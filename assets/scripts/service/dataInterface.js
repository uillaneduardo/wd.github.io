//Enum Slot
const Slot = Object.freeze({ A: 0, B: 1, C: 2 });
const Pool = Object.freeze({ Diario: 0, Oferta: 1 });

//Origem dos dados

const diario_A = {};
const diario_B = {
    titulo: 'EMIS Persona', raridade: 'E', custo: 0,
    descricao: 'Carro clássico inspirado no Opala SS e no Maverick',
    bloqueado: false, revelado: false, clamado: false,
    caminhoIcone: 'images/icone-carro.png',
    caminhoCarta: 'images/card-carro.png',
    caminhoMascara: 'images/silhueta-carro.png'
};
const diario_C = {};
const oferta_A = {};
const oferta_B = {
    titulo: 'EMIS Sparta', raridade: 'L', custo: 250,
    descricao: 'Carro secular inspirado nos primeiros carros da Ford',
    bloqueado: false, revelado: false, clamado: false,
    caminhoIcone: 'images/icone-carro.png',
    caminhoCarta: 'images/card-carro.png',
    caminhoMascara: 'images/silhueta-carro.png'
};
const oferta_C = {};

const dados_slot = { [Pool.Diario]: [diario_A, diario_B, diario_C], [Pool.Oferta]: [oferta_A, oferta_B, oferta_C] };
const dados_colecao = {
    [Pool.Diario]: [
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', clamado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', clamado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'E', clamado: false }
    ], [Pool.Oferta]: []

}
const dados_progresso = {
    xp: 70,
    conquistas: [
        { caminhoIcone: 'images/icones/progresso.png', titulo: 'Conquista A', descricao: 'Primeira Conquista!', xp: 10, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', titulo: 'Conquista B', descricao: 'Segunda Conquista!', xp: 50, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', titulo: 'Conquista C', descricao: 'Terceira Conquista!', xp: 100, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', titulo: 'Conquista D', descricao: 'Quarta Conquista!', xp: 170, clamado: false },
        { caminhoIcone: 'images/icones/progresso.png', titulo: 'Conquista E', descricao: 'Quinta Conquista!', xp: 400, clamado: false }
    ]
}
const dados_inventario = [
    {caminhoIcone: 'images/icones/inventario.png', titulo:'Item A', descricao: 'Um item aleatório para testar o inventário'},
    {caminhoIcone: 'images/icones/inventario.png', titulo:'Item B', descricao: 'Um item aleatório para testar o inventário'},
    {caminhoIcone: 'images/icones/inventario.png', titulo:'Item C', descricao: 'Um item aleatório para testar o inventário'},
    {caminhoIcone: 'images/icones/inventario.png', titulo:'Item D', descricao: 'Um item aleatório para testar o inventário'},
    {caminhoIcone: 'images/icones/inventario.png', titulo:'Item E', descricao: 'Um item aleatório para testar o inventário'}
]
const dados_top10 = [
    {rank: '1', nome: 'Primeiro', nivel: 'Magnata', xp: 2490},
    {rank: '2', nome: 'Segundo', nivel: 'Magnata', xp: 2110},
    {rank: '3', nome: 'Terceiro', nivel: 'Astro', xp: 1845},
    {rank: '4', nome: 'Quarto', nivel: 'Astro', xp: 1550},
    {rank: '5', nome: 'Quinto', nivel: 'Astro', xp: 1510},
    {rank: '6', nome: 'Sexto', nivel: 'Astro', xp: 1480},
    {rank: '7', nome: 'Sétimo', nivel: 'Astro', xp: 1410},
    {rank: '8', nome: 'Oitavo', nivel: 'Astro', xp: 1385},
    {rank: '9', nome: 'Nono', nivel: 'Astro', xp: 1380},
    {rank: '10', nome: 'Décimo', nivel: 'Astro', xp: 1270},
    {rank: '2830', nome: 'você', nivel: 'Habilitado', xp: 70}

];
const dados_ranking = [
    {rank: '2835', nome: 'Bryan', nivel: 'Habilitado', xp: 80},
    {rank: '2834', nome: 'Matheus', nivel: 'Habilitado', xp: 77},
    {rank: '2833', nome: 'Enzo', nivel: 'Habilitado', xp: 73},
    {rank: '2832', nome: 'Fernando', nivel: 'Habilitado', xp: 73},
    {rank: '2831', nome: 'Gilmar', nivel: 'Habilitado', xp: 72},
    {rank: '2830', nome: 'Você', nivel: 'Habilitado', xp: 70},
    {rank: '2829', nome: 'Eitor', nivel: 'Habilitado', xp: 67},
    {rank: '2828', nome: 'Otávio', nivel: 'Habilitado', xp: 67},
    {rank: '2827', nome: 'Mariana', nivel: 'Habilitado', xp: 63},
    {rank: '2826', nome: 'Júlio', nivel: 'Habilitado', xp: 62},
    {rank: '2825', nome: 'Vanessa', nivel: 'Habilitado', xp: 60}

];
//Assinatura pública
export const Server =
{
    Slot, Pool,
    card: buscarSlot,
    colecao: buscarColecao,
    progresso: buscarProgresso,
    inventario: buscarInventario,
    ranking: buscarRanking
};

/**
 * @typedef {Object} Server.SlotInterface
 * @property {() => string} qualTitulo
 * @property {() => string} qualDescricao
 * @property {() => boolean} foiBloqueado
 * @property {() => boolean} foiRevelado
 * @property {() => boolean} foiComprado
 * @property {(relativo?: string) => string} qualCaminhoIcone
 * @property {(relativo?: string) => string} qualCaminhoCarta
 * @property {(relativo?: string) => string} qualCaminhoMascara
 * @property {(relativo?: string) => string} qualUrlIcone
 * @property {(relativo?: string) => string} qualUrlCarta
 * @property {(relativo?: string) => string} qualUrlMascara
 * @property {() => ('C'|'R'|'E'|'L'|'')} qualRaridade
 * @property {() => string} pegarRaridadeFormatada
 * @property {() => string} qualCorRaridade
 * @property {() => number} qualCusto
 * @property {() => string} pegarCustoFormatado
 * @property {() => boolean} revelar
 * @property {() => boolean} comprar
 */

/**
 * @param {Server.Pool} pool
 * @param {number} slot
 * @returns {Readonly<Server.SlotInterface>}
 */
function buscarSlot(pool, slot) {
    //Interface do Slot
    return Object.freeze({
        // Leitura
        qualTitulo() { return dados_slot[pool]?.[slot]?.titulo ?? 'Slot Bloqueado'; },
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
        qualUrlIcone(relativo = './') { return `url('${this.qualCaminhoIcone(relativo)}')` },
        qualUrlCarta(relativo = './') { return `url('${this.qualCaminhoCarta(relativo)}')` },
        qualUrlMascara(relativo = './') { return `url('${this.qualCaminhoMascara(relativo)}')` },

        qualRaridade() { return dados_slot[pool]?.[slot]?.raridade ?? ''; },
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
        qualCusto() { return dados_slot[pool]?.[slot]?.custo ?? 0; },
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
function buscarColecao(pool) {
    //Interface da Coleção
    return Object.freeze({
        //Leitura
        tamanho() { return dados_colecao[pool]?.length ?? 0; },
        qualCaminhoIcone(indice, relativo = './') { return relativo + (dados_colecao[pool]?.[indice]?.caminhoIcone ?? ''); },
        qualTitulo(indice) { return dados_colecao[pool]?.[indice]?.titulo ?? ''; },
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
function buscarProgresso() {
    return Object.freeze({
        //Leitura
        quantidadeXP() { return dados_progresso?.xp ?? 0; },
        conquistaTamanho() { return dados_progresso?.conquistas?.length ?? 0; },
        conquistaCaminhoIcone(indice, relativo) { return relativo + (dados_progresso?.conquistas[indice]?.caminhoIcone ?? ''); },
        conquistaTitulo(indice) { return dados_progresso?.conquistas[indice]?.titulo ?? 'Error'; },
        conquistaDescricao(indice) { return dados_progresso?.conquistas[indice]?.descricao ?? 'Não encontrado' },
        conquistaRequisitoXP(indice) { return dados_progresso?.conquistas[indice]?.xp ?? '0'; },
        conquistaClamada(indice) { return dados_progresso?.conquistas[indice]?.clamado ?? false; },
        conquistasResumidas() {
            const n = this.conquistaTamanho();
            if (n <= 3) return dados_progresso.conquistas?.slice(0, n);

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
                return dados_progresso?.conquistas?.slice(start, n);
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

            return dados_progresso?.conquistas?.slice(start, start + 3);
        }

    })
}
function buscarInventario() {
    return Object.freeze({
        tamanho(){return dados_inventario.length;},
        caminhoIcone(indice, relativo = './'){return relativo + (dados_inventario[indice]?.caminhoIcone ?? '');},
        qualTitulo(indice){return dados_inventario[indice]?.titulo ?? 'Error';},
        qualDescricao(indice){return dados_inventario[indice]?.descricao ?? 'Ocorreu um problema';},

        qualUrlIcone(indice, relativo = './'){return `url('${this.caminhoIcone(indice, relativo)}')`;}
    })
}
function buscarRanking(){
    return Object.freeze({
        top10(){return dados_top10;},
        pessoal(){return dados_ranking;}
    })
}