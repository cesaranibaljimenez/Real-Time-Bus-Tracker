

	let map;
	const markers = [];

	async function initMap() {
            // Crea el mapa
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 42.353350, lng: -71.091525 },
                zoom: 14
            });

			// Inicia el ciclo de actualización de marcadores
            run();
		}

		async function run() {
            while (true) {
                // Obtiene datos de ubicación de autobuses
                const locations = await getBusLocations();

                // Actualiza los marcadores en el mapa
                updateMarkers(locations);

                // Muestra la hora actual y los datos en la consola
                console.log(new Date());
                console.log(locations);

                // Espera 15 segundos antes de la próxima actualización
                await new Promise(resolve => setTimeout(resolve, 15000));
            }
        }

		function updateMarkers(locations) {

            // Elimina los marcadores anteriores
            clearMarkers();

            // Carga imágenes personalizadas para los marcadores

            const redBusIcon = {
                url:"https://github.com/cesaranibaljimenez/MBTABUSTRACKER/blob/main/red.png?raw=true",
                scaledSize: new google.maps.Size(32, 32)
            };

            const blueBusIcon = {
                url: "https://github.com/cesaranibaljimenez/MBTABUSTRACKER/blob/main/blue.png?raw=true",
                scaledSize: new google.maps.Size(32, 32)
            };

            // Crea y agrega marcadores para cada autobús

            locations.forEach(bus => {
                let icon;
                if (bus.attributes.direction_id === 0) {
                    icon = redBusIcon;
                } else {
                    icon = blueBusIcon;
                }

                const marker = new google.maps.Marker({
                    position: {
                        lat: bus.attributes.latitude,
                        lng: bus.attributes.longitude
                    },

                    map: map,
                    title: `Bus ID: ${bus.id}`,
                    icon : icon // Establece el icono personalizado
                });
                markers.push(marker);
            });
        }

		function clearMarkers() {
            markers.forEach(marker => {
                marker.setMap(null); // Elimina el marcador del mapa
            });
            markers.length = 0; // Limpia el arreglo de marcadores
        }
	
	// Request bus data from MBTA
	async function getBusLocations(){
		const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
		const response = await fetch(url);
		const json     = await response.json();
		return json.data;
	}
	

	