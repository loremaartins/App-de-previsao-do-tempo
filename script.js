const API_KEY = "d0a095f493e848c5b05192054241606";
const BASE_URL = "https://api.weatherapi.com/v1";

const cidadeInput = document.getElementById('cidade');
const btnBuscar = document.getElementById('btnBuscar');
const card = document.getElementById('card');
const erro = document.getElementById('erro');
const carregando = document.getElementById('carregando');

// Carregar última cidade salva
window.addEventListener('load', () => {
    const ultima = localStorage.getItem('ultimaCidade');
    if (ultima) {
        cidadeInput.value = ultima;
        buscarTempo(ultima);
    }
});

btnBuscar.addEventListener('click', () => {
    const cidade = cidadeInput.value.trim();
    if (cidade) buscarTempo(cidade);
});

cidadeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cidade = cidadeInput.value.trim();
        if (cidade) buscarTempo(cidade);
    }
});

async function buscarTempo(cidade) {
    try {
        mostrarCarregando();

        const resposta = await fetch(
            `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&lang=pt`
        );

        if (!resposta.ok) throw new Error('Cidade não encontrada');

        const dados = await resposta.json();
        
        // Salvar cidade
        localStorage.setItem('ultimaCidade', cidade);
        
        mostrarDados(dados);

    } catch (erroBusca) {
        mostrarErro();
    }
}

function mostrarDados(dados) {
    esconderTudo();

    document.getElementById('nomeCidade').textContent = `${dados.location.name}, ${dados.location.country}`;
    
    const data = new Date(dados.location.localtime);
    document.getElementById('dataHora').textContent = data.toLocaleString('pt-BR');
    
    document.getElementById('tempValor').textContent = `${Math.round(dados.current.temp_c)}°C`;
    document.getElementById('descricao').textContent = dados.current.condition.text;
    document.getElementById('umidade').textContent = `${dados.current.humidity}%`;
    document.getElementById('vento').textContent = `${dados.current.wind_kph} km/h`;
    document.getElementById('sensacao').textContent = `${Math.round(dados.current.feelslike_c)}°C`;

    // Escolher ícone
    const codigo = dados.current.condition.code;
    const iconeEl = document.getElementById('icone');
    
    if (codigo === 1000) {
        iconeEl.textContent = dados.current.is_day ? '☀️' : '🌙';
    } else if ([1003, 1006].includes(codigo)) {
        iconeEl.textContent = '⛅';
    } else if ([1009, 1030, 1135, 1147].includes(codigo)) {
        iconeEl.textContent = '☁️';
    } else if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(codigo)) {
        iconeEl.textContent = '🌧️';
    } else if ([1087, 1273, 1276, 1279, 1282].includes(codigo)) {
        iconeEl.textContent = '⛈️';
    } else if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264].includes(codigo)) {
        iconeEl.textContent = '❄️';
    } else {
        iconeEl.textContent = '🌤️';
    }

    card.classList.remove('escondido');
}

function mostrarCarregando() {
    esconderTudo();
    carregando.classList.remove('escondido');
}

function mostrarErro() {
    esconderTudo();
    erro.classList.remove('escondido');
}

function esconderTudo() {
    card.classList.add('escondido');
    erro.classList.add('escondido');
    carregando.classList.add('escondido');
}
