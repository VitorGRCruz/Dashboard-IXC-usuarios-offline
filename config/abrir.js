window.addEventListener('DOMContentLoaded', async function () {
   
    const urlParams = new URLSearchParams(window.location.search);
    let mapa = urlParams.get('mapa');
    let filtro = urlParams.get('filtro');
    let showHeader = urlParams.get('showHeader');
    if (!urlParams.has('filtro')) {
        filtro = 'todos';
    }

    if (urlParams.has('mapa')) {
        var conteudo;
        switch (mapa) {

            case 'cidades': conteudo = 'Cidades'; break;
            case 'presp': conteudo = 'Pres. Prudente'; break;
            case 'franca': conteudo = 'Franca'; break;
        }
        document.querySelector(".select-label").textContent = conteudo;
    }
    else {
        document.querySelector(".select-label").textContent = 'Cidades';
        mapa = 'cidades';

    }

    if (!urlParams.has('showHeader')) {
        showHeader = 'visivel';
    }
    if (showHeader == 'visivel') {
        const header = document.querySelector('.header');
        header.classList.remove('hidden');

        const topIcon = document.querySelector('.top-icon');
        topIcon.style.display = 'none';
    }
    else if (showHeader == 'oculto') {
        const header = document.querySelector('.header');
        header.classList.add('hidden');

        const topIcon = document.querySelector('.top-icon');
        topIcon.style.display = 'block';

        document.addEventListener('mousemove', function (event) {
            const icon = document.querySelector('.top-icon');
            const windowHeight = window.innerHeight;
            const mouseY = event.clientY;

            if (mouseY <= windowHeight * 0.03) {
                icon.style.display = 'block';
            } else {
                icon.style.display = 'none';
            }
        });
    }
    var dashboardDiv = document.getElementById('dashboard');

    async function atualizarDados() {
        try {
            const response = await fetch('./config/off.php?flag=1&filtro=' + filtro + '&mapa=' + mapa);
            if (response.ok) {
                const resposta = await response.json();
                const num_retorno = Object.keys(resposta).length;
                dashboardDiv.innerHTML=' ';
                tratarRequisicao(num_retorno,resposta);

            } else {
                throw new Error("Erro na requisição.");
            }
        } catch (error) {
            console.log(error);
        }
    }
    setInterval(atualizarDados, 10000);

    try {
        const response = await fetch('./config/off.php?flag=1&filtro=' + filtro + '&mapa=' + mapa);
        if (response.ok) {
            const resposta = await response.json();
            const num_retorno = Object.keys(resposta).length;
            tratarRequisicao(num_retorno,resposta);
        } else {
            throw new Error("Erro na requisição.");
        }
    } catch (error) {
        console.log(error);
    }

function tratarRequisicao(num_retorno,resposta){
    var classe;
    if (num_retorno > 25 && num_retorno < 49) {
        classe = 'bloco_medio';
    }
    else if (num_retorno > 49) {
        classe = 'bloco_menor';
    }
    else {
        classe = 'bloco_padrao';
    }
    for (const bloco in resposta) {
        gerarBloco(bloco, resposta[bloco], classe);
    }
}

    function gerarBloco(bloco, valor, classe) {
        var div_bloco = document.createElement('div');
        div_bloco.className = 'city ' + classe;

        div_bloco.id = bloco.toLowerCase().replace(/ /g, '_');

        var h3 = document.createElement('h3');
        h3.textContent = bloco;
        h3.className = 'conteudo';


        var p = document.createElement('h2');
        p.id = div_bloco.id + '-status';
        p.className = 'conteudo';
        p.innerHTML = valor;


        var value = parseInt(valor);
        if (value >= 1 && value <= 5) {
            div_bloco.classList.add('amarelo');
            h3.classList.add('conteudo2');
            p.classList.add('conteudo2');
        } else if (value >= 6 && value <= 10) {
            div_bloco.classList.add('laranja');
        } else if (value > 10) {
            div_bloco.classList.add('vermelho');
        } else if (value == 0) {
            div_bloco.classList.add('verde');
        }

        div_bloco.appendChild(h3);
        div_bloco.appendChild(p);
        dashboardDiv.appendChild(div_bloco);

        div_bloco.addEventListener('mouseenter', function () {
            this.classList.add('city-hover');
        });
    }
   
    var modal = document.getElementById('modal_clientes');
    var closeModal = document.getElementsByClassName('close')[0];
     dashboardDiv.addEventListener('click', async function (event) {
        var tbody = document.getElementById("tabela_clientes");
        var titulo = document.getElementById("titulo");
        var target = event.target;
        var div_bloco = target.closest('.city');
        var conteudoElement = target.closest('.conteudo');
        if (div_bloco || conteudoElement) {
            var nome_bloco = div_bloco.firstChild.textContent;
            var numOff = document.getElementById(div_bloco.id + '-status').textContent;
            if (numOff != 0) {
                try {
                    const response = await fetch("./config/off.php?flag=2&regiao=" + nome_bloco + "&filtro=" + filtro + "&mapa=" + mapa);
                    if (response.ok) {
                        tbody.innerHTML = "";
                        titulo.innerHTML = "";
                        
                        const resposta = await response.json();
                        titulo = document.getElementById("titulo");
                        titulo.innerHTML = nome_bloco + ' - ' + numOff + ' Clientes offline';
                        gerarTabela(resposta);
                        modal.style.display = 'flex';
                    } else {
                        throw new Error("Erro na requisição.");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        
    });
    closeModal.addEventListener('click', function () {
        closeModalFunc(modal)
    });
    this.document.getElementById('fechar').addEventListener('click', function () {
        closeModalFunc(modal)
    })
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            closeModalFunc(modal)
        }
    });
    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeModalFunc(modal)
        }
    });

});

function closeModalFunc(modal) {
    modal.style.display = 'none';
    var tbody = document.getElementById("tabela_clientes");
    var titulo = document.getElementById("titulo");
    tbody.innerHTML = "";
    titulo.innerHTML = "";
}
function gerarTabela(dados) {
    var tbody = document.getElementById("tabela_clientes");

    var tr = document.createElement('tr');

    var headers = ['Login', 'ONU', 'CTO', 'Concentrador', 'Último Down', 'Último UP', 'Endereço', 'Info'];

    headers.forEach(function (headerText) {
        var th = document.createElement('th');
        th.textContent = headerText;
        tr.appendChild(th);
    });
    tbody.appendChild(tr);
    for (var i = 0; i < dados.length; i++) {
        var objeto = dados[i];
        var tr = document.createElement("tr");
        for (var prop in objeto) {
            if (objeto.hasOwnProperty(prop)) {
                if (prop !== "telefone" && prop !== "OS") {
                    var td = document.createElement("td");
                    if (prop !== "nome") {
                        td.appendChild(document.createTextNode(objeto[prop]));
                        switch (prop) {
                            case "down":
                                td.classList.add("down");
                                break;
                            case "up":
                                td.classList.add("up");
                                break;
                            case "login":
                                var copyIcon = document.createElement('img');
                                copyIcon.id = 'copySucess';
                                copyIcon.src = './assets/midia/copy.png';
                                copyIcon.classList.add('icon');
                                copyIcon.style.verticalAlign = 'middle';
                                copyIcon.style.float = 'right';
                                td.appendChild(copyIcon);
                                copyIcon.addEventListener('click', criarEventoClique(objeto.nome, copyIcon));
                                break;
                        }
                    }
                    else {
                        var tooltip = document.createElement('span');
                        tooltip.classList.add('tooltip');
                        td.appendChild(tooltip);

                        var infoIcon = document.createElement('img');
                        infoIcon.src = './assets/midia/telefone.png';
                        infoIcon.classList.add('icon');
                        tooltip.appendChild(infoIcon);

                        var tooltipText = document.createElement('span');
                        tooltipText.classList.add('tooltip-text');
                        tooltipText.innerHTML = objeto.telefone;
                        tooltip.appendChild(tooltipText);
                        if (objeto.OS != null) {

                            var tooltip_caution = document.createElement('span');
                            tooltip_caution.classList.add('tooltip');
                            td.appendChild(tooltip_caution);

                            var caution = document.createElement('img');
                            caution.src = './assets/midia/caution.png';
                            caution.classList.add('icon');
                            tooltip_caution.appendChild(caution);

                            var textCaution = document.createElement('span');
                            textCaution.classList.add('tooltip-text');
                            textCaution.innerHTML = objeto.OS;
                            tooltip_caution.appendChild(textCaution);
                        }

                    }

                }

                tr.appendChild(td);
            }
        }

        tbody.appendChild(tr);
    }
}
function criarEventoClique(nome, copyIcon) {
    return function () {
        copiarParaAreaTransferencia(nome, copyIcon);
    };
}


function copiarParaAreaTransferencia(texto, copyIcon) {
    var textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    copyIcon.src = './assets/midia/sucess.png';
    setTimeout(function () {
        copyIcon.src = './assets/midia/copy.png';
    }, 1000);
}


