import { Server } from './service/dataInterface.js';
// @ts-check

const root = document.documentElement;
const btnSelecionarDiario = document.getElementById("btn-recompensa-diaria");
const btnSelecionarOferta = document.getElementById("btn-oferta-especial");
let btnSelecionado = Server.Pool.Diario;


///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// ÁREA RECOMPENSA //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const cardSlotA = document.getElementById("slot-a");
const cardSlotB = document.getElementById("slot-b");
const cardSlotC = document.getElementById("slot-c");

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

cardSlotA.addEventListener('animationend', () => { aoRevelarSlot(cardSlotA, Server.Slot.A); });
cardSlotB.addEventListener('animationend', () => { aoRevelarSlot(cardSlotB, Server.Slot.B); });
cardSlotC.addEventListener('animationend', () => { aoRevelarSlot(cardSlotC, Server.Slot.C); });

cardSlotA.querySelector("button").addEventListener('click', () => { popupConfirmarCompra(Server.Slot.A) });
cardSlotB.querySelector("button").addEventListener('click', () => { popupConfirmarCompra(Server.Slot.B) });
cardSlotC.querySelector("button").addEventListener('click', () => { popupConfirmarCompra(Server.Slot.C) });

// Recompensa diária selecionada ao carregar
selecionarDiario();


function selecionarDiario() {

    btnSelecionado = Server.Pool.Diario;
    btnSelecionarDiario.classList.remove('btn-liberdade');
    btnSelecionarDiario.classList.add('btn-autoescola');

    btnSelecionarOferta.classList.remove('btn-autoescola');
    btnSelecionarOferta.classList.add('btn-liberdade');

    aoSelecionar();
}
function selecionarOferta() {

    btnSelecionado = Server.Pool.Oferta;
    btnSelecionarDiario.classList.remove('btn-autoescola');
    btnSelecionarDiario.classList.add('btn-liberdade');

    btnSelecionarOferta.classList.remove('btn-liberdade');
    btnSelecionarOferta.classList.add('btn-autoescola');

    aoSelecionar();
}

function aoSelecionar() {
    const slotA = Server.card(btnSelecionado, Server.Slot.A);
    const slotB = Server.card(btnSelecionado, Server.Slot.B);
    const slotC = Server.card(btnSelecionado, Server.Slot.C);

    cardSlotA.style.setProperty('--slot-card', slotA.qualUrlCarta('../'));
    cardSlotB.style.setProperty('--slot-card', slotB.qualUrlCarta('../'));
    cardSlotC.style.setProperty('--slot-card', slotC.qualUrlCarta('../'));

    cardSlotA.style.setProperty('--slot-silhueta', slotA.qualUrlMascara('../'));
    cardSlotB.style.setProperty('--slot-silhueta', slotB.qualUrlMascara('../'));
    cardSlotC.style.setProperty('--slot-silhueta', slotC.qualUrlMascara('../'));

    cardSlotA.style.setProperty('--cor-raridade', slotA.qualCorRaridade());
    cardSlotB.style.setProperty('--cor-raridade', slotB.qualCorRaridade());
    cardSlotC.style.setProperty('--cor-raridade', slotC.qualCorRaridade());

    cardSlotA.querySelector("h3").textContent = slotA.qualTitulo();
    cardSlotA.querySelector("button").textContent = slotA.pegarCustoFormatado();

    cardSlotB.querySelector("h3").textContent = slotB.qualTitulo();
    cardSlotB.querySelector("button").textContent = slotB.pegarCustoFormatado();

    cardSlotC.querySelector("h3").textContent = slotC.qualTitulo();
    cardSlotC.querySelector("button").textContent = slotC.pegarCustoFormatado();

    gerenciarCardClasses(cardSlotA, slotA);
    gerenciarCardClasses(cardSlotB, slotB);
    gerenciarCardClasses(cardSlotC, slotC);
}

/**
 * 
 * @param {Element} cardElement 
 * @param {Server.SlotInterface} cardObject
 * @returns 
 */
function gerenciarCardClasses(cardElement, cardObject) {
    if (cardObject.foiBloqueado()) {
        cardElement.classList.remove(...['slot-raridade', 'revelando-card']);
    } else {
        if (cardObject.foiRevelado()) {
            cardElement.classList.add('slot-raridade');
            cardElement.classList.remove('revelando-card');
        } else {
            cardElement.classList.add('revelando-card');
            cardElement.classList.remove('slot-raridade');
        }
    }
    cardElement.classList.remove('aguardando-revelar');
}

function revelandoSlot(cardSlot) {
    if (cardSlot.classList.contains('revelando-card')) {
        cardSlot.classList.add('aguardando-revelar');
    }
}


function aoRevelarSlot(cardElement, slot) {
    cardElement.classList.remove('aguardando-revelar');
    cardElement.classList.remove('revelando-card');
    cardElement.classList.add('slot-raridade');
    Server.card(btnSelecionado, slot).revelar();

}

function popupConfirmarCompra(slot) {

    const cardObject = Server.card(btnSelecionado, slot);

    if (cardObject.foiComprado() || cardObject.foiBloqueado()) return;

    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    const buttonClasses = 'btn-autoescola btn-sombra-adrenalina style-rebelde-r';

    const cardRaridade = cardObject.pegarRaridadeFormatada();
    const cardRaridadeCor = cardObject.qualCorRaridade();
    const cardTitle = `${cardObject.qualTitulo()} 
                        <i style="color: ${cardRaridadeCor}; font-size: 0.90rem; background-color: black;">
                            [${cardRaridade}]
                        </i>`;
    const cardDescription = cardObject.qualDescricao();
    const cardIcone = cardObject.qualCaminhoIcone('../assets/');
    const cardPrice = cardObject.pegarCustoFormatado();

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



///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// RESGATE RECOMPENSA //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const btnColecao = document.getElementById("btn-colecao");
const resetTime = document.getElementById("reset-time");

btnColecao.addEventListener('click', mostrarColecao);

// Atualiza o timer de reset ao carregar
atualizarContagemRegressiva();
// Atualiza o timer de reset a cada segundo
setInterval(atualizarContagemRegressiva, 1000);



function mostrarColecao() {
    //
    const colecao = Server.colecao(btnSelecionado);

    const popupTitulo = btnSelecionado === Server.Pool.Diario ? 'Coleção Diária' : 'Coleção Especial';
    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    let popupConteudo;
    let itensHTML = '';

    for (let i = 0; i < colecao.tamanho(); i++) {

        const icone = colecao.qualCaminhoIcone(i, '../assets/');
        const nome = colecao.qualTitulo(i);
        const probabilidade = colecao.qualProbabilidade(i);
        const raridade = colecao.pegarRaridadeFormatada(i);
        const riscar = colecao.foiComprado(i) ? 'text-decoration: line-through;' : '';
        const coletar = colecao.foiComprado(i) ? '' : 'background-color: grey';

        itensHTML += `
            <li class="style-autoescola popup-list" style="${coletar}">
                <img style="width:35px; height:35px;" src="${icone}" alt="${nome}" />
                <p style="${riscar}">${nome} | ${raridade} | ${probabilidade}</p>
            </li>`;

    }

    if (colecao.tamanho() > 0) {
        popupConteudo =
            `<ul class="lista-itens">
            ${itensHTML}
        </ul>`;

    } else {
        //Se a lista não existir, exibir uma mensagem
        popupConteudo =
            `<p>
            Faaaala, motorista, tudo bem? Por enquanto nossa lojinha com ofertas especiais está na oficina mecânica. <br>
            Mas eu gostaria de aproveitar para te convidar a visitar nossa campanha de financiamento do modo Liberdade! <br>
            Aproveita porque quem participar da campanha vai ganhar 3x mais moedas para gastar aqui na loja. o/
        </p>`;
    }

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses });
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// CONQUISTAS ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const progressoResumido = document.getElementById('progresso-resumido');
const barraProgressoFill = document.getElementById('progresso-resumido-barra-fill');

progressoResumido.addEventListener('click', mostrarProgresso);

atualizarProgresso();

function atualizarProgresso() {
    const progresso = Server.progresso().conquistasResumidas();
    const xp = Server.progresso().quantidadeXP();
    const barraXp = (xp / progresso[2].xp) * 100;
    const conquistaAlvo = (progresso[1].xp / progresso[2].xp) * 100;

    const imgA = document.getElementById('progresso-a');
    const imgB = document.getElementById('progresso-b');
    const imgC = document.getElementById('progresso-c');

    barraProgressoFill.style.width = `${barraXp}%`;
    imgA.src = "../assets/" + progresso[0].caminhoIcone;
    imgB.src = "../assets/" + progresso[1].caminhoIcone;
    imgC.src = "../assets/" + progresso[2].caminhoIcone;

    imgB.style.left = `${conquistaAlvo}%`;

    barraProgressoFill.querySelector('span').textContent = xp > 0 ? xp + 'xp' : xp;
}

function mostrarProgresso() {
    const progresso = Server.progresso();

    const popupTitulo = "Progresso das Conquistas";
    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    let popupConteudo;
    let itensHTML = '';

    for (let i = 0; i < progresso.conquistaTamanho(); i++) {

        const icone = progresso.conquistaCaminhoIcone(i, '../assets/');
        const nome = progresso.conquistaTitulo(i);
        const descricao = progresso.conquistaDescricao(i);
        const conquistaXp = progresso.conquistaRequisitoXP(i);
        const xp = Math.min(progresso.quantidadeXP(), conquistaXp);
        const barraWidth = ((xp / conquistaXp) * 100) + '%';

        const barraConquistaStyle = `
            background: linear-gradient(90deg,
            var(--cor-autoescola) 0%,
            var(--cor-autoescola) ${barraWidth},
            grey ${barraWidth},
            grey 100%);
        `;


        itensHTML += `
            <li class="style-autoescola popup-list balao" data-balao="${descricao}" style="${barraConquistaStyle}">
                <img style="width:35px; height:35px;" src="${icone}" alt="${nome}" />
                <span>${nome}</span>
                <span>${xp} / ${conquistaXp}xp</span>
            </li>`;

    }


    popupConteudo =
        `<ul class="lista-itens">
            ${itensHTML}
        </ul>`;

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses });
}