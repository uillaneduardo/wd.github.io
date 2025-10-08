import { GROUP, Slot } from './service/slots.js';
import { RewardService } from './service/rewardService.js';
import { MockServerSource } from './service/mockServerSource.js';
import { LocalJsonSource } from './service/localJsonSource.js';

const source = new MockServerSource();                          //Gera json aleatório
//const source = new LocalJsonSource('/data/rewards.json');     //Se for utilizar um json local fixo
//const source = new LocalJsonSource('/api/rewards');          //Quando API estiver pronta
const service = new RewardService(source);
await service.load();

const root = document.documentElement;
const resetTime = document.getElementById("reset-time");
const wrapperRecompensa = document.getElementById("wrapper-recompensa");
const cardSlotA = document.getElementById("slot-a");
const cardSlotB = document.getElementById("slot-b");
const cardSlotC = document.getElementById("slot-c");
const btnSelecionarDiario = document.getElementById("btn-recompensa-diaria");
const btnSelecionarOferta = document.getElementById("btn-oferta-especial");
let btnSelecionado = GROUP.DAILY;

const recompensaSwiper = new Swiper('#area-recompensa', {
    direction: 'horizontal',
    slidesPerView: 'auto',
    spaceBetween: 12,
    centeredSlides: true,
    centerInsufficientSlides: true,
    centeredSlidesBounds: true,
    slideToClickedSlide: true,
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
    teleportSwap(recompensaSwiper, 'left', selecionarOferta);
});

cardSlotA.addEventListener('click', () => { revelandoSlot(cardSlotA) });
cardSlotB.addEventListener('click', () => { revelandoSlot(cardSlotB) });
cardSlotC.addEventListener('click', () => { revelandoSlot(cardSlotC) });

cardSlotA.addEventListener('animationend', () => { aoRevelarSlot(cardSlotA) });
cardSlotB.addEventListener('animationend', () => { aoRevelarSlot(cardSlotB) });
cardSlotC.addEventListener('animationend', () => { aoRevelarSlot(cardSlotC) });

cardSlotA.querySelector("button").addEventListener('click', () => {popupConfirmarCompra(Slot.A)});
cardSlotB.querySelector("button").addEventListener('click', () => {popupConfirmarCompra(Slot.B)});
cardSlotC.querySelector("button").addEventListener('click', () => {popupConfirmarCompra(Slot.C)});

// Recompensa diária selecionada ao carregar
selecionarDiario();
// Atualiza o timer de reset ao carregar
atualizarContagemRegressiva();
// Atualiza o timer de reset a cada segundo
setInterval(atualizarContagemRegressiva, 1000);


function selecionarDiario() {

    btnSelecionado = GROUP.DAILY;
    btnSelecionarDiario.classList.remove('btn-liberdade');
    btnSelecionarDiario.classList.add('btn-autoescola');

    btnSelecionarOferta.classList.remove('btn-autoescola');
    btnSelecionarOferta.classList.add('btn-liberdade');

    aoSelecionar(Slot.A, Slot.B, Slot.C);
    removerAguardandoRevelar();
}
function selecionarOferta() {

    btnSelecionado = GROUP.SPECIAL;
    btnSelecionarDiario.classList.remove('btn-autoescola');
    btnSelecionarDiario.classList.add('btn-liberdade');

    btnSelecionarOferta.classList.remove('btn-liberdade');
    btnSelecionarOferta.classList.add('btn-autoescola');

    aoSelecionar(Slot.D, Slot.E, Slot.F);
    removerAguardandoRevelar();
}

function aoSelecionar(slotA, slotB, slotC) {
    cardSlotA.style.setProperty('--slot-card', service.getCardUrl(slotA));
    cardSlotB.style.setProperty('--slot-card', service.getCardUrl(slotB));
    cardSlotC.style.setProperty('--slot-card', service.getCardUrl(slotC));

    cardSlotA.style.setProperty('--slot-silhueta', service.getMaskUrl(slotA));
    cardSlotB.style.setProperty('--slot-silhueta', service.getMaskUrl(slotB));
    cardSlotC.style.setProperty('--slot-silhueta', service.getMaskUrl(slotC));

    cardSlotA.style.setProperty('--cor-raridade', service.getRarityColor(slotA));
    cardSlotB.style.setProperty('--cor-raridade', service.getRarityColor(slotB));
    cardSlotC.style.setProperty('--cor-raridade', service.getRarityColor(slotC));

    cardSlotA.querySelector("h3").textContent = service.getTitle(slotA);
    cardSlotA.querySelector("button").textContent = service.getPrettyPrice(slotA);

    cardSlotB.querySelector("h3").textContent = service.getTitle(slotB);
    cardSlotB.querySelector("button").textContent = service.getPrettyPrice(slotB);

    cardSlotC.querySelector("h3").textContent = service.getTitle(slotC);
    cardSlotC.querySelector("button").textContent = service.getPrettyPrice(slotC);

    const classAddA = service.getStateClassToAdd(slotA);
    const classAddB = service.getStateClassToAdd(slotB);
    const classAddC = service.getStateClassToAdd(slotC);

    const classRemoveA = service.getStateClassToRemove(slotA);
    const classRemoveB = service.getStateClassToRemove(slotB);
    const classRemoveC = service.getStateClassToRemove(slotC);

    if (classAddA && classAddA.length) cardSlotA.classList.add(...classAddA);
    if (classAddB && classAddB.length) cardSlotB.classList.add(...classAddB);
    if (classAddC && classAddC.length) cardSlotC.classList.add(...classAddC);

    if (classRemoveA && classRemoveA.length) cardSlotA.classList.remove(...classRemoveA);
    if (classRemoveB && classRemoveB.length) cardSlotB.classList.remove(...classRemoveB);
    if (classRemoveC && classRemoveC.length) cardSlotC.classList.remove(...classRemoveC);
}

function revelandoSlot(cardSlot) {
    if (cardSlot.classList.contains('revelando-card')) {
        cardSlot.classList.add('aguardando-revelar');
    }
}
function aoRevelarSlot(cardSlot) {
    cardSlot.classList.remove('aguardando-revelar');
    cardSlot.classList.remove('revelando-card');
    cardSlot.classList.add('slot-raridade');
}
function removerAguardandoRevelar() {
    cardSlotA.classList.remove('aguardando-revelar');
    cardSlotB.classList.remove('aguardando-revelar');
    cardSlotC.classList.remove('aguardando-revelar');
}

function popupConfirmarCompra(slot) {
    const slotSelecionado = slot + 3 * btnSelecionado;
    if(service.isClaimed(slotSelecionado) || service.isLocked(slotSelecionado)) return;

    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    const buttonClasses = 'btn-autoescola btn-sombra-adrenalina style-rebelde-r';

    const cardRaridade = service.getPrettyRarity(slotSelecionado);
    const cardRaridadeCor = service.getRarityColor(slotSelecionado);
    const cardTitle = `${service.getTitle(slotSelecionado)} 
                        <i style="color: ${cardRaridadeCor}; font-size: 0.90rem; background-color: black;">
                            [${cardRaridade}]
                        </i>`;
    const cardDescription = service.getDescription(slotSelecionado);
    const cardIcone = service.getIconPath(slotSelecionado, '../assets/');
    const cardPrice = service.getPrettyPrice(slotSelecionado);
    
    const contentInflate =
        `<div style="display: flex; flex-direction: column; align-items: center; max-width: 300px;">

            <h3 style="text-align: center;">${cardTitle}</h3>

            <img style="border-radius: 5px; width:100px; height: 100px;" src="${cardIcone}" alt="Ícone">

            <p style="text-align: justify;">
                ${cardDescription}<br>
                Custo: ${cardPrice}
            </p>

            <button class="${buttonClasses}">Confirmar</button>

        </div>`
    ;

    Popup.show({ title: '', content: contentInflate, classes: popupClasses });

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

function atualizarContagemRegressiva() {
    if (!resetTime) return;

    const agora = new Date();
    const meiaNoite = new Date();

    // Define o horário de reset para o próximo dia às 00:00:00
    meiaNoite.setHours(24, 0, 0, 0);

    const diferenca = meiaNoite - agora;

    if (diferenca <= 0) {
        resetTime.textContent = "00:00:00s";
        // Recarrega a página ao atingir meia-noite
        location.reload();
        return;
    }

    // Calcula horas, minutos e segundos restantes
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    // Formata o tempo no estilo 16:59:10s
    const tempoFormatado =
        (horas < 10 ? "0" : "") + horas + ":" +
        (minutos < 10 ? "0" : "") + minutos + ":" +
        (segundos < 10 ? "0" : "") + segundos + "s";

    resetTime.textContent = tempoFormatado;
}