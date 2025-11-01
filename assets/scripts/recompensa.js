// @ts-checks
import {Server} from './service/dataInterface.js';
await Server.conectar();
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
    const slotA = Server?.card(btnSelecionado, Server.Slot.A);
    const slotB = Server?.card(btnSelecionado, Server.Slot.B);
    const slotC = Server?.card(btnSelecionado, Server.Slot.C);

    cardSlotA.style.setProperty('--slot-card', slotA.qualUrlCarta('../../'));
    cardSlotB.style.setProperty('--slot-card', slotB.qualUrlCarta('../../'));
    cardSlotC.style.setProperty('--slot-card', slotC.qualUrlCarta('../../'));

    cardSlotA.style.setProperty('--cor-raridade', slotA.qualCorRaridade());
    cardSlotB.style.setProperty('--cor-raridade', slotB.qualCorRaridade());
    cardSlotC.style.setProperty('--cor-raridade', slotC.qualCorRaridade());

    cardSlotA.querySelector("h3").textContent = slotA.qualNome();
    cardSlotA.querySelector("button").textContent = slotA.pegarCustoFormatado();

    cardSlotB.querySelector("h3").textContent = slotB.qualNome();
    cardSlotB.querySelector("button").textContent = slotB.pegarCustoFormatado();

    cardSlotC.querySelector("h3").textContent = slotC.qualNome();
    cardSlotC.querySelector("button").textContent = slotC.pegarCustoFormatado();

    gerenciarCardClasses(cardSlotA, slotA);
    gerenciarCardClasses(cardSlotB, slotB);
    gerenciarCardClasses(cardSlotC, slotC);
}

function gerenciarCardClasses(cardElement, cardObject) {
    if (cardObject.foiBloqueado()) {
        cardElement.classList.remove(...['slot-revelado', 'slot-mascarado']);
    } else {
        if (cardObject.foiRevelado()) {
            cardElement.classList.add('slot-revelado');
            cardElement.classList.remove('slot-mascarado');
        } else {
            cardElement.classList.add('slot-mascarado');
            cardElement.classList.remove('slot-revelado');
        }
    }
    cardElement.classList.remove('slot-revelando');
}

function revelandoSlot(cardSlot) {
    if (cardSlot.classList.contains('slot-mascarado')) {
        cardSlot.classList.add('slot-revelando');
    }
}


function aoRevelarSlot(cardElement, slot) {
    cardElement.classList.remove('slot-revelando');
    cardElement.classList.remove('slot-mascarado');
    cardElement.classList.add('slot-revelado');
    Server?.card(btnSelecionado, slot).revelar();

}

//debug 
 //   console.log({ slotId: cardObject.qualID?.() ?? dados.slots[btnSelecionado][slot].id, pool: btnSelecionado });
    

function popupConfirmarCompra(slot) {
    
    const cardObject = Server?.card(btnSelecionado, slot);

    

    if (cardObject.foiComprado() || cardObject.foiBloqueado()) return;

    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    const buttonClasses = 'btn-autoescola btn-sombra-adrenalina style-rebelde-r';

    const cardRaridade = cardObject.pegarRaridadeFormatada();
    const cardRaridadeCor = cardObject.qualCorRaridade();
    const cardTitle = `${cardObject.qualNome()} 
                        <i style="color: ${cardRaridadeCor}; font-size: 0.90rem; background-color: black;">
                            [${cardRaridade}]
                        </i>`;
    const cardDescription = cardObject.qualDescricao();
    const cardIcone = cardObject.qualCaminhoIcone();
    const cardPrice = cardObject.pegarCustoFormatado();

    const contentInflate =
        `<div style="display: flex; flex-direction: column; align-items: center; max-width: 300px;">

            <h3 style="text-align: center;">${cardTitle}</h3>

            <img style="border-radius: 5px; width:100px; height: 100px;" src="${cardIcone}" alt="Icone">

            <p style="text-align: justify;">
                ${cardDescription}<br>
                Custo: ${cardPrice}
            </p>

            <button class="${buttonClasses}">Confirmar</button>

        </div>`
        ;

    Popup.show({ title: '', content: contentInflate, classes: popupClasses});

    const popupContent = document.getElementById('popup-content');
    const confirmarBtn = popupContent?.querySelector('button');
    if (!confirmarBtn) return;

    confirmarBtn.addEventListener('click', async () => {
        if (confirmarBtn.disabled) return;

        const textoOriginal = confirmarBtn.textContent;
        confirmarBtn.disabled = true;
        confirmarBtn.textContent = 'Processando...';

        try {
            const sucesso = await cardObject.comprar();
            if (sucesso) {
                Popup.close();
                aoSelecionar();
                return;
            }
        } catch (err) {
            console.error('Nao foi possivel concluir a compra.', err);
        }

        confirmarBtn.disabled = false;
        confirmarBtn.textContent = textoOriginal;
    }, { once: true });
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
    const colecao = Server?.colecao(btnSelecionado);

    const popupTitulo = btnSelecionado === Server.Pool.Diario ? 'Coleção Diária' : 'Coleção Especial';
    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    let popupConteudo;
    let itensHTML = '';

    for (let i = 0; i < colecao.tamanho(); i++) {

        const icone = colecao.qualCaminhoIcone(i);
        const nome = colecao.qualNome(i);
        const probabilidade = colecao.qualProbabilidade(i);
        const raridade = colecao.pegarRaridadeFormatada(i);
        const riscar = colecao.foiComprado(i) ? 'text-decoration: line-through;' : '';
        const coletar = colecao.foiComprado(i) ? '' : 'background-color: grey';

        itensHTML += `
            <li class="style-autoescola popup-list balao" data-balao="${probabilidade}" style="${coletar}">
                <img style="width:35px; height:35px;" src="${icone}" alt="${nome}" />
                <p style="${riscar}; min-width: min(200px, 50vw);">${nome} | ${raridade}</p>
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
            Faaaala, motorista, tudo bem? Por enquanto nossa lojinha com ofertas especiais está na oficina mecânica. <br><br>
            Mas eu gostaria de aproveitar para te convidar a visitar nossa campanha de financiamento do modo Liberdade!
            Aproveita porque quem participar da campanha vai ganhar 3x mais moedas para gastar aqui na loja. o/
            </p>`;
    }

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses});
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
    const progresso = Server?.progresso()?.conquistasResumidas();
    const xp = Server?.progresso()?.quantidadeXP();

    const xpAlvoAnterior = progresso[0]?.xp ?? 0;
    const xpAlvoAtual = progresso[1]?.xp ?? 1;
    const xpAlvoProximo = progresso[2]?.xp ?? 2;

    const barraXp = (Math.max(0,(xp - xpAlvoAnterior)) / (xpAlvoProximo - xpAlvoAnterior)) * 100;
    const conquistaAlvo = ((xpAlvoAtual - xpAlvoAnterior) / (xpAlvoProximo - xpAlvoAnterior)) * 100;

    const imgA = document.getElementById('progresso-a');
    const imgB = document.getElementById('progresso-b');
    const imgC = document.getElementById('progresso-c');

    barraProgressoFill.style.width = `${barraXp}%`;
    imgA.src = "./" + progresso[0]?.caminhoIcone;
    imgB.src = "./" + progresso[1]?.caminhoIcone;
    imgC.src = "./" + progresso[2]?.caminhoIcone;

    imgB.style.left = `${conquistaAlvo}%`;

    barraProgressoFill.querySelector('span').textContent = barraXp > 5 ? ' ' + xp : '';
}

function mostrarProgresso() {
    const progresso = Server?.progresso();

    const popupTitulo = "Progresso das Conquistas";
    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    let popupConteudo;
    let itensHTML = '';

    for (let i = 0; i < progresso.conquistaTamanho(); i++) {

        const icone = progresso.conquistaCaminhoIcone(i);
        const nome = progresso.conquistaNome(i);
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
                <span class = "bi bi-award-fill">${xp} / ${conquistaXp}</span>
            </li>`;

    }


    popupConteudo =
        `<ul class="lista-itens">
            ${itensHTML}
        </ul>`;

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////// INVENTÁRIO ///////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const inventarioItens = document.getElementById('inventario-itens');
addEventListener('resize', atualizarInventario);

atualizarInventario();

function atualizarInventario(){
    const inventario = Server?.inventario();
    const classes = 'body-autoescola balao style-rebelde-r';
    let itensHTML = '';

    for(let i = 0; i < inventario.tamanho(); i++){
        
        const nome = inventario.qualNome(i);
        const url = inventario.qualUrlIcone(i);
        const descricao = nome + ' - ' + inventario.qualDescricao(i);
        const extraStyle = 
        `
            background-image: ${url};
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
        `;
        

        itensHTML += `<div style="${extraStyle}" class="${classes}" data-balao="${descricao}"></div>`;
    }

    inventarioItens.innerHTML = completarSlots(itensHTML, inventario.tamanho());
}


function completarSlots(itensHTML = '', itens = inventarioItens.children.length, minCols = 3, minRows = 3) {
  const grid = inventarioItens;

  // nº de colunas da grid no tamanho atual
  const colsAtuais = (getComputedStyle(grid).gridTemplateColumns || '')
    .split(' ')
    .filter(Boolean).length || 1;

  const colunas = Math.max(colsAtuais, minCols);
  const linhas = Math.max(minRows, Math.ceil(itens / colunas));

  const totalDesejado = colunas * linhas;
  let faltam = totalDesejado - itens;

  while (faltam-- > 0) {
    itensHTML += `<div class="body-autoescola balao style-rebelde-r" data-balao="- espaço para item"></div>`;
  }
  return itensHTML;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// RANKING ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function mostrarRanking(){
    const ranking = Server?.ranking().pessoal();
    const popupTitulo = "Ranking de Apoiadores";
    const popupClasses = ['style-liberdade', 'style-rebelde-l', 'style-sombra-adrenalina'];
    let itensHTML = '';

    for(let i = 0; i < ranking.length; i++){
        //
        const rank = ranking[i].rank;
        const nome = ranking[i].nome;
        const nivel = ranking[i].nivel;
        const xp = ranking[i].xp;
        const styleClasse = ranking[i].id === Server?.perfil().qualID() ? "style-adrenalina" : "style-autoescola";

        itensHTML += `
            <li class="${styleClasse} popup-list balao" data-balao="${nivel}">
                <span>${rank}</span>
                <span>${nome}</span>
                <span class="bi bi-award-fill">${xp}</span>
            </li>`;

    }

    const popupConteudo =
        `<ul>
            ${itensHTML}
        </ul>`;

    Popup.show({ title: popupTitulo, content: popupConteudo, classes: popupClasses });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// PERFIL /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const btnPerfil = document.getElementById('btn-profile');
const perfilNome = document.getElementById('perfil-nome');
const perfilNivel = document.getElementById('perfil-nivel');
const perfilMoeda = document.getElementById('perfil-moeda');
const perfilXp = document.getElementById('perfil-xp');

const btnConquistas = document.getElementById('btn-conquistas');
const btnRanking = document.getElementById('btn-ranking');
const btnRegistros = document.getElementById('btn-registros');
const btnDesconectar = document.getElementById('btn-desconectar');

btnConquistas.addEventListener('click', mostrarProgresso);
btnRanking.addEventListener('click', mostrarRanking);
btnDesconectar.addEventListener('click', () => { Server?.desconectar(); location.reload(); });

atualizarPerfil();

function atualizarPerfil(){
    const perfil = Server?.perfil();
    if (!perfil) return;
    perfilNome.textContent = perfil.qualNome();
    perfilNivel.textContent = 'Nível: ' + perfil.qualNivel();
    perfilMoeda.textContent = ' ' + perfil.quantasMoedas();
    perfilXp.textContent = ' ' + perfil.quantoXp();

    const imgPerfil = perfil.qualUrlImagem();
    if(imgPerfil.includes('nulo') || imgPerfil.includes('undefined')){
        btnPerfil.removeProperty('background-image');
        btnPerfil.classList.add('bi', 'bi-person-fill');
    } else {
        btnPerfil.style.setProperty('background-image', imgPerfil);
        btnPerfil.classList.remove('bi', 'bi-person-fill');
    }
}
