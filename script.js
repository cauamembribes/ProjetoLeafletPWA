if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration =>
        console.log("--- SW REGISTADO ---")
    ).catch(error =>
        console.error("--- ERRO AO REGISTRAR O SW ---")
    )
}


const map = L.map('map').setView([-23.555298, -46.635319], 2); // instaciação do mapa

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const geoJsonUrl = 'https://raw.githubusercontent.com/giuliano-macedo/geodata-br-states/refs/heads/main/geojson/br_states.json';

fetch(geoJsonUrl)
    .then(response => response.json())
    .then(dados => {

        dados.features.forEach(feature => {
            if (feature.properties.Estado === "São Paulo") {
                feature.properties.TX_Alfab = 95.7;

            }
            else if (feature.properties.Estado == "Paraná") {
                feature.properties.TX_Alfab = 93.7;
            }
        })


        function getColor(d) {
            return d > 90 ? '#800026' :
                d > 85 ? '#BD0026' :
                    d > 80 ? '#E31A1C' :
                        d > 75 ? '#FC4E2A' :
                            d > 70 ? '#FD8D3C' :
                                d > 65 ? '#FEB24C' :
                                    d > 60 ? '#FED976' :
                                        '#FFEDA0';
        }
        function style(dados) {
            return {
                fillColor: getColor(dados.properties.TX_Alfab),
                weight: 2,
                opacity: 0.7,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }

        function onEachFeature(dados, layer) {
            if (dados.properties && dados.properties.Estado && dados.properties.TX_Alfab) {
                layer.bindPopup(`
                    <div style="font-family: Arial; text-align: center;">
                    <h3 style="margin:0;">${dados.properties.Estado}</h3>
                    <p style="margin:0;">📊 Taxa de alfabetização: <b>${dados.properties.TX_Alfab.toFixed(1)}%</b></p>
                    </div>
            `);
            }
        }


        L.geoJSON(dados, { style: style, onEachFeature: onEachFeature }).addTo(map);
    }).catch(err => console.error("Erro ao carregar", err))
