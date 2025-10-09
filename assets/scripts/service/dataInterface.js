//Enum Slot
const Slot = Object.freeze({ A: 0, B: 1, C: 2 });
const Pool = Object.freeze({ Diario: 0, Oferta: 1 });

//Origem dos dados

const diario_A = {};
const diario_B = {
    titulo: 'EMIS Persona', raridade: 'E', custo: 0,
    descricao: 'Carro clássico inspirado no Opala SS e no Maverick',
    bloqueado: false, revelado: false, comprado: false,
    caminhoIcone: 'images/icone-carro.png',
    caminhoCarta: 'images/card-carro.png',
    caminhoMascara: 'images/silhueta-carro.png'
};
const diario_C = {};
const oferta_A = {};
const oferta_B = {
    titulo: 'EMIS Sparta', raridade: 'L', custo: 250,
    descricao: 'Carro secular inspirado nos primeiros carros da Ford',
    bloqueado: false, revelado: false, comprado: false,
    caminhoIcone: 'images/icone-carro.png',
    caminhoCarta: 'images/card-carro.png',
    caminhoMascara: 'images/silhueta-carro.png'
};
const oferta_C = {};

const dados_slot = { [Pool.Diario]: [diario_A, diario_B, diario_C], [Pool.Oferta]: [oferta_A, oferta_B, oferta_C] };
const dados_colecao = {
    [Pool.Diario]: [
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'C', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', comprado: true },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'R', comprado: false },
        { caminhoIcone: 'images/icone-carro.png', titulo: 'EMIS Persona', raridade: 'E', comprado: false }
    ], [Pool.Oferta]: []

}

//Assinatura pública
export const Server =
{
    Slot, Pool,
    card: buscarSlot,
    colecao: buscarColecao,
    progresso: buscarProgresso,
    inventario: buscarInventario
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
        foiComprado() { return dados_slot[pool]?.[slot]?.comprado ?? false; },

        qualCaminhoIcone(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoIcone ?? 'images/icone-cadeado.png');
        },
        qualCaminhoCarta(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoCarta ?? 'images/silhueta-cadeado.png');
        },
        qualCaminhoMascara(relativo = './') {
            return relativo + (dados_slot[pool]?.[slot]?.caminhoMascara ?? 'images/silhueta-cadeado.png');
        },
        qualUrlIcone(relativo = './') { return `url("${this.qualCaminhoIcone(relativo)}")` },
        qualUrlCarta(relativo = './') { return `url("${this.qualCaminhoCarta(relativo)}")` },
        qualUrlMascara(relativo = './') { return `url("${this.qualCaminhoMascara(relativo)}")` },

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
        comprar() { dados_slot[pool][slot].comprado = true; return true; },

    });
}

/**
 * @typedef {Objcet} Server.ColecaoInterface
 * @property {(indice: number, relativo?: string) => string} qualCaminhoIcone
 * @property {(indice: number) => string} qualTitulo
 * @property {(indice: number) => ('C'|'R'|'E'|'L'|'')} qualRaridade
 * @property {(indice: number) => boolean} foiComprado
 */

/**
 * 
 * @param {Server.Pool} pool 
 * @returns {Readonly<Server.ColecaoInterface>}
 */
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
        foiComprado(indice) { return dados_colecao[pool]?.[indice]?.comprado ?? false; },
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
function buscarProgresso() { }
function buscarInventario() { }