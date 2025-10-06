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
const slotA = document.getElementById("slot-a");
const slotB = document.getElementById("slot-b");
const slotC = document.getElementById("slot-c");
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
    freeMode: { enabled: false, sticky: true },
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

slotA.addEventListener('click', () => {revelandoSlot(slotA)});
slotB.addEventListener('click', () => {revelandoSlot(slotB)});
slotC.addEventListener('click', () => {revelandoSlot(slotC)});

slotA.addEventListener('animationend', () => {aoRevelarSlot(slotA)});
slotB.addEventListener('animationend', () => {aoRevelarSlot(slotB)});
slotC.addEventListener('animationend', () => {aoRevelarSlot(slotC)});

selecionarDiario();

function selecionarDiario() {

    slotA.style.setProperty('--slot-card', service.getCardUrl(Slot.A));
    slotB.style.setProperty('--slot-card', service.getCardUrl(Slot.B));
    slotC.style.setProperty('--slot-card', service.getCardUrl(Slot.C));

    slotA.style.setProperty('--cor-raridade', service.getRarityColor(Slot.A));
    slotB.style.setProperty('--cor-raridade', service.getRarityColor(Slot.B));
    slotC.style.setProperty('--cor-raridade', service.getRarityColor(Slot.C));

    slotA.classList.add(service.getStateClassToAdd(Slot.A));
    slotB.classList.add(service.getStateClassToAdd(Slot.B));
    slotC.classList.add(service.getStateClassToAdd(Slot.C));

    slotA.classList.remove(service.getStateClassToRemove(Slot.A));
    slotB.classList.remove(service.getStateClassToRemove(Slot.B));
    slotC.classList.remove(service.getStateClassToRemove(Slot.C));

    btnSelecionarDiario.classList.remove('btn-liberdade');
    btnSelecionarDiario.classList.add('btn-autoescola');

    btnSelecionarOferta.classList.remove('btn-autoescola');
    btnSelecionarOferta.classList.add('btn-liberdade');

    removerAguardandoRevelar();
}
function selecionarOferta() {

    slotA.style.setProperty('--slot-card', service.getCardUrl(Slot.D));
    slotB.style.setProperty('--slot-card', service.getCardUrl(Slot.E));
    slotC.style.setProperty('--slot-card', service.getCardUrl(Slot.F));

    slotA.style.setProperty('--cor-raridade', service.getRarityColor(Slot.D));
    slotB.style.setProperty('--cor-raridade', service.getRarityColor(Slot.E));
    slotC.style.setProperty('--cor-raridade', service.getRarityColor(Slot.F));

    slotA.classList.add(service.getStateClassToAdd(Slot.D));
    slotB.classList.add(service.getStateClassToAdd(Slot.E));
    slotC.classList.add(service.getStateClassToAdd(Slot.F));

    slotA.classList.remove(service.getStateClassToRemove(Slot.D));
    slotB.classList.remove(service.getStateClassToRemove(Slot.E));
    slotC.classList.remove(service.getStateClassToRemove(Slot.F));

    btnSelecionarDiario.classList.remove('btn-autoescola');
    btnSelecionarDiario.classList.add('btn-liberdade');

    btnSelecionarOferta.classList.remove('btn-liberdade');
    btnSelecionarOferta.classList.add('btn-autoescola');

    removerAguardandoRevelar();
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
    slotA.classList.remove('aguardando-revelar');
    slotB.classList.remove('aguardando-revelar');
    slotC.classList.remove('aguardando-revelar');
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

