const cidadeInput = document.getElementById('cidade');
const btnBuscar = document.getElementById('btnBuscar');
const card = document.getElementById('card');
const erro = document.getElementById('erro');
const carregando = document.getElementById('carregando');

window.addEventListener('load', () => {
    const salva = localStorage.getItem('ultimaCidade');
    if (salva) { 
        cidadeInput.value = salva; 
        buscarTempo(salva); 
    }
});

btnBuscar.addEventListener('click', () => {
    const cid = cidadeInput.value.trim();
    if (cid) buscarTempo(cid);
});

cidadeInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') { 
        const cid = cidadeInput.value.trim(); 
        if (cid) buscarTempo(cid); 
    }
});

async function buscarTempo(cidade) {
    try {
        mostrarCarregando();
        const resposta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=1b0a4b506630d3426c9e9e2c487f1a79&units=metric&lang=pt_br`
        );
        if (!resposta.ok) throw new Error('Não encontrada');
        const dados = await resposta.json();
        localStorage.setItem('ultimaCidade', cidade);
        mostrarDados(dados);
    } catch {
        mostrarErro();
    }
}

function mostrarDados(dados) {
    esconderTudo();
    document.getElementById('nomeCidade').textContent = `${dados.name}, ${dados.sys.country}`;
    document.getElementById('dataHora').textContent = new Date().toLocaleString('pt-BR');
    document.getElementById('tempValor').textContent = `${Math.round(dados.main.temp)}°C`;
    document.getElementById('descricao').textContent = dados.weather[0].description;
    document.getElementById('umidade').textContent = `${dados.main.humidity}%`;
    document.getElementById('vento').textContent = `${Math.round(dados.wind.speed * 3.6)} km/h`;
    document.getElementById('sensacao').textContent = `${Math.round(dados.main.feels_like)}°C`;

    const icone = dados.weather[0].icon;
    const el = document.getElementById('icone');
    if (icone.includes('01')) el.textContent = '☀️';
    else if (icone.includes('02')) el.textContent = '⛅';
    else if (icone.includes('03') || icone.includes('04')) el.textContent = '☁️';
    else if (icone.includes('09') || icone.includes('10')) el.textContent = '🌧️';
    else if (icone.includes('11')) el.textContent = '⛈️';
    else if (icone.includes('13')) el.textContent = '❄️';
    else el.textContent = '🌤️';

    card.classList.remove('escondido');
}

function mostrarCarregando() { esconderTudo(); carregando.classList.remove('escondido'); }
function mostrarErro() { esconderTudo(); erro.classList
