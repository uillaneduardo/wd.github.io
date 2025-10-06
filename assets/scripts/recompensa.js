import { Slot } from './service/slots.js';
import { RewardService } from './service/rewardService.js';
import { MockServerSource } from './service/mockServerSource.js';
import { LocalJsonSource } from './service/localJsonSource.js';

const source = new MockServerSource();                          //Gera json aleatório
//const source = new LocalJsonSource('/data/rewards.json');     //Se for utilizar um json local fixo
//const source = new LocalJsonSource('/api/rewards');          //Quando API estiver pronta
const service = new RewardService(source);
await service.load();

const root = document.documentElement;
const wrapperRecompensa = document.getElementById("wrapper-recompensa");
const cardSlotA = document.getElementById("slot-a");
const cardSlotB = document.getElementById("slot-b");
const cardSlotC = document.getElementById("slot-c");
const btnSelecionarDiario = document.getElementById("btn-recompensa-diaria");
const btnSelecionarOferta = document.getElementById("btn-oferta-especial");

const recompensaSwiper = new Swiper('#area-recompensa', {
    direction: 'horizontal',
    slidesPerView: 'auto',
    spaceBetween: 12,
    centeredSlides: true,
    centerInsufficientSlides: true,
    centeredSlidesBounds: true,
    initialSlide: 1,
    freeMode: { enabled: true, sticky: true },
    grabCursor: true,
    keyboard: { enabled: true }
});

btnSelecionarDiario.addEventListener('click', () => {
    let selecionado = btnSelecionarDiario.classList.contains('btn-autoescola');
    if (selecionado) return; //Impede de executar a animação e a troca quando já estiver selecionado
    teleportSwap(recompensaSwiper, 'left', selecionarDiario);
});
btnSelecionarOferta.addEventListener('click', () => {
    let selecionado = btnSelecionarOferta.classList.contains('btn-autoescola');
    if (selecionado) return; //Impede de executar a animação e a troca quando já estiver selecionado
    teleportSwap(recompensaSwiper, 'right', selecionarOferta);
});

cardSlotA.addEventListener('click', () => {revelandoSlot(cardSlotA)});
cardSlotB.addEventListener('click', () => {revelandoSlot(cardSlotB)});
cardSlotC.addEventListener('click', () => {revelandoSlot(cardSlotC)});

cardSlotA.addEventListener('animationend', () => {aoRevelarSlot(cardSlotA)});
cardSlotB.addEventListener('animationend', () => {aoRevelarSlot(cardSlotB)});
cardSlotC.addEventListener('animationend', () => {aoRevelarSlot(cardSlotC)});

selecionarDiario();

function selecionarDiario() {

    btnSelecionarDiario.classList.remove('btn-liberdade');
    btnSelecionarDiario.classList.add('btn-autoescola');

    btnSelecionarOferta.classList.remove('btn-autoescola');
    btnSelecionarOferta.classList.add('btn-liberdade');

    aoSelecionar(Slot.A, Slot.B, Slot.C);
    removerAguardandoRevelar();
}
function selecionarOferta() {

    btnSelecionarDiario.classList.remove('btn-autoescola');
    btnSelecionarDiario.classList.add('btn-liberdade');

    btnSelecionarOferta.classList.remove('btn-liberdade');
    btnSelecionarOferta.classList.add('btn-autoescola');

    aoSelecionar(Slot.D, Slot.E, Slot.F);
    removerAguardandoRevelar();
}

function aoSelecionar(slotA, slotB, slotC){
    cardSlotA.style.setProperty('--slot-card', service.getCardUrl(slotA));
    cardSlotB.style.setProperty('--slot-card', service.getCardUrl(slotB));
    cardSlotC.style.setProperty('--slot-card', service.getCardUrl(slotC));

    cardSlotA.style.setProperty('--slot-silhueta', service.getMaskUrl(slotA));
    cardSlotB.style.setProperty('--slot-silhueta', service.getMaskUrl(slotB));
    cardSlotC.style.setProperty('--slot-silhueta', service.getMaskUrl(slotC));

    cardSlotA.style.setProperty('--cor-raridade', service.getRarityColor(slotA));
    cardSlotB.style.setProperty('--cor-raridade', service.getRarityColor(slotB));
    cardSlotC.style.setProperty('--cor-raridade', service.getRarityColor(slotC));

    cardSlotA.classList.add(service.getStateClassToAdd(slotA));
    cardSlotB.classList.add(service.getStateClassToAdd(slotB));
    cardSlotC.classList.add(service.getStateClassToAdd(slotC));

    cardSlotA.classList.remove(service.getStateClassToRemove(slotA));
    cardSlotB.classList.remove(service.getStateClassToRemove(slotB));
    cardSlotC.classList.remove(service.getStateClassToRemove(slotC));
}

function revelandoSlot(cardSlot){
    if(cardSlot.classList.contains('revelando-card')){
        cardSlot.classList.add('aguardando-revelar');
    }
}
function aoRevelarSlot(cardSlot){
    cardSlot.classList.remove('aguardando-revelar');
    cardSlot.classList.remove('revelando-card');
    cardSlot.classList.add('slot-raridade');
}
function removerAguardandoRevelar(){
    cardSlotA.classList.remove('aguardando-revelar');
    cardSlotB.classList.remove('aguardando-revelar');
    cardSlotC.classList.remove('aguardando-revelar');
}



/**
 * Joga o Swiper pra fora e volta pro centro.
 * @param {Swiper} swiper            Instância do Swiper
 * @param {'left'|'right'} dir       Direção de saída
 * @param {Function} midAction       Executa no “meio” (entre out e in). Troque os cards aqui.
 */
function teleportSwap(swiper, dir = 'left', midAction = () => { }) {
    const el = swiper.el; // container do Swiper
    if (!el || el.classList.contains('teleport-out') || el.classList.contains('teleport-in')) return;

    // define direção: -120% sai à esquerda, 120% à direita
    el.style.setProperty('--teleport-x', dir === 'left' ? '-120%' : '120%');

    // ANIMAÇÃO: OUT
    el.classList.remove('teleport-in');
    void el.offsetWidth;             // reinicia a animação
    el.classList.add('teleport-out');

    el.addEventListener('animationend', function onOutEnd() {
        el.removeEventListener('animationend', onOutEnd);

        // troque conteúdo / mude seleção aqui
        midAction();

        // re-centra instantâneo se precisar (ex.: slide do meio)
        swiper.setTransition(0);
        swiper.slideTo(1, 0); // ajuste o índice que você usa como “centro”

        // ANIMAÇÃO: IN
        el.classList.remove('teleport-out');
        void el.offsetWidth;
        el.classList.add('teleport-in');

        el.addEventListener('animationend', function onInEnd() {
            el.removeEventListener('animationend', onInEnd);
            el.classList.remove('teleport-in'); // limpa estado
        }, { once: true });
    }, { once: true });
}

