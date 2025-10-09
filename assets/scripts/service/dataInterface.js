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
 * @param {number} pool
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
function buscarColecao() { }
function buscarProgresso() { }
function buscarInventario() { }