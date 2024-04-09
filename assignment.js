document.addEventListener('DOMContentLoaded', function () {

  fetch('https://api-colombia.com/api/v1/President')
    .then(response => response.json())
    .then(data => {
      const presidentsSelect = document.getElementById('presidents-select');

      data.sort((a, b) => a.name.localeCompare(b.name));
      data.forEach(president => {
        const option = document.createElement('option');
        option.value = president.id.toString();
        option.textContent = `${president.name} ${president.lastName}`;
        option.dataset.cityId = president.cityId;
        presidentsSelect.appendChild(option);

      });

      presidentsSelect.addEventListener('change', function (event) {
        if (event.target.value === "") return;
        const selectedOption = event.target.selectedOptions[0];
        const selectedPresidentId = selectedOption.value;
        const selectedCityId = selectedOption.dataset.cityId;
        const selectedPresident = data.find(president => president.id.toString() === selectedPresidentId); // Comparar como string
        if (selectedPresident) {
          showPresidentInfo(selectedPresident, selectedCityId);
        }
      });
    })
    .catch(error => console.error('Error al obtener los datos de la API:', error));

  function showPresidentInfo(president, cityId) {
    const presidentInfoContainer = document.getElementById('president-info');
    presidentInfoContainer.innerHTML = `
   
      <img class="mx-auto max-h-[40px] max-w-[40px]" src="${president.image}" alt="${president.name}">
      <h2>${president.name} ${president.lastName}</h2>
      <p><strong>Periodo:</strong> ${president.startPeriodDate} - ${president.endPeriodDate}</p>
      <p><strong>Partido Político:</strong> ${president.politicalParty}</p>
      <p><strong>Descripción:</strong> ${president.description}</p>
      <p><strong>Ciudad de Nacimiento:</strong> <span id="city-name">${cityId ? 'Cargando...' : 'No especificada'}</span></p>
    `;

   
    if (cityId) {
      fetch(`https://api-colombia.com/api/v1/City/${cityId}`)
        .then(response => response.json())
        .then(city => {
          const cityNameElement = document.getElementById('city-name');
          cityNameElement.textContent = city.name;
        })
        .catch(error => console.error('Error al obtener los datos de la ciudad:', error));
    }
  }
});