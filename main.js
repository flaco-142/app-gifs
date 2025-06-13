import './style.css';

const API_KEY = 'wO2hF3SjK410ZFVB1z7k0b7SxnxuN2n2';

const app = document.getElementById('app');

app.innerHTML = `
  <h1>Gif's con Escencia</h1>
  <div class="search-container">
    <input type="text" id="searchInput" placeholder="¿Qué vas a buscar hoy?..." />
    <button id="searchBtn">Buscar</button>
  </div>
  <div id="resultsContainer" class="results"></div>
  <div id="paginationContainer"></div>
`;

let currentSearchTerm = '';
let currentOffset = 0;
const limit = 20;

function buscarGifs(reset = true) {
  const searchTerm = document.getElementById('searchInput').value.trim();

  // Si reset es true, reiniciamos offset y resultados
  if (reset) {
    currentOffset = 0;
    currentSearchTerm = searchTerm;
    document.getElementById('resultsContainer').innerHTML = '';
  }

  if (searchTerm === "") {
    document.getElementById('resultsContainer').innerHTML = "<p>Por favor, escribe un término de búsqueda.</p>";
    document.getElementById('paginationContainer').innerHTML = "";
    return;
  }

  const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(currentSearchTerm)}&limit=${limit}&offset=${currentOffset}&rating=g`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const gifs = data.data;
      const resultsContainer = document.getElementById('resultsContainer');
      const paginationContainer = document.getElementById('paginationContainer');

      if (gifs.length === 0 && currentOffset === 0) {
        resultsContainer.innerHTML = `<p>No se encontraron resultados para <strong>${currentSearchTerm}</strong>.</p>`;
        paginationContainer.innerHTML = "";
        return;
      }

      // Añadimos los gifs al contenedor sin borrar los anteriores (append)
      gifs.forEach(gif => {
        const gifHTML = `
          <div class="gif-card">
            <img src="${gif.images.fixed_height.url}" alt="${gif.title}" />
          </div>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', gifHTML);
      });

      // Si hay más resultados, mostramos el botón "Cargar más"
      if (data.pagination.total_count > currentOffset + limit) {
        paginationContainer.innerHTML = `
          <button id="loadMoreBtn">Cargar más</button>
        `;

        document.getElementById('loadMoreBtn').addEventListener('click', () => {
          currentOffset += limit;
          buscarGifs(false); // No reiniciamos resultados, solo cargamos más
        });
      } else {
        paginationContainer.innerHTML = "";
      }
    })
    .catch(error => {
      console.error('Error al obtener los GIFs:', error);
      document.getElementById('resultsContainer').innerHTML = "<p>Ocurrió un error al cargar los resultados. Intenta nuevamente.</p>";
      document.getElementById('paginationContainer').innerHTML = "";
    });
}

// Buscar al hacer click en el botón
document.getElementById('searchBtn').addEventListener('click', () => buscarGifs(true));

// Buscar al presionar Enter en el input
document.getElementById('searchInput').addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    buscarGifs(true);
  }
});