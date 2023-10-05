function toggleOptions() {
    const selectOptions = document.getElementById("selectOptions");
    if (selectOptions.style.display === "none") {
      selectOptions.style.display = "block";
    } else {
      selectOptions.style.display = "none";
    }
  }

  function selectOption(option,mapa) {
    const selectedOption = option.textContent;
    document.querySelector(".select-label").textContent = selectedOption;
    document.getElementById("selectOptions").style.display = "none";

    
    const urlParams = new URLSearchParams(window.location.search);

    const filtro = urlParams.get('filtro');
    if (filtro) {
        urlParams.set('filtro', filtro);
    }


    urlParams.set('mapa', mapa);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.location.href = newUrl
  }

  document.addEventListener("click", function(event) {
    const targetElement = event.target;
    if (!targetElement.closest(".custom-select")) {
      document.getElementById("selectOptions").style.display = "none";
    }
  });




const toggle = document.getElementById('toggle');
const urlParams = new URLSearchParams(window.location.search);
const filtro = urlParams.get('filtro');
toggle.checked = (filtro === 'ndesliga');
toggle.addEventListener('change', function () {
    const slider = document.querySelector('.slider');
    slider.classList.toggle('toggle-on');

    const novoFiltro = toggle.checked ? 'ndesliga' : 'todos';
    urlParams.set('filtro', novoFiltro);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.location.href = newUrl
});

function hideHeader() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('showHeader', 'oculto');
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.location.href = newUrl
  
}

function showHeader() {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('showHeader', 'visivel');
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.location.href = newUrl
}
