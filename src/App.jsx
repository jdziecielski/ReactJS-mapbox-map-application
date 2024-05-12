import mapboxgl from "mapbox-gl";
import { v4 as uuidv4 } from "uuid";
import React, { useRef, useEffect, useState, useReducer } from "react";
import Searchbar from "./components/Searchbar";
import NavigationBar from "./components/NavigationBar";
import MarkerBrowser from "./components/MarkerBrowser";
import ComponentMenu from "./components/ComponentMenu";

mapboxgl.accessToken = null;
const apikey = null;

const loadLocalStorageMarkers = (markersRef) => {
  const markersLocalStorage = localStorage.getItem("markers");
  if (markersLocalStorage) {
    const markersParsed = JSON.parse(markersLocalStorage);
    const newMarkers = markersParsed.map(({ name, lng, lat, id }) => ({
      name: name,
      marker: new mapboxgl.Marker({ className: "marker" }).setLngLat([
        lng,
        lat,
      ]),
      id: id,
      lng: lng,
      lat: lat,
    }));

    newMarkers.map((marker) => {
      const doesExist = markersRef.current.some(
        (markerSome) => marker.id === markerSome.id
      );
      if (!doesExist) {
        // marker.marker
        //   .getElement()
        //   .addEventListener("click", () => markerOpenPopup(marker));
        // marker.marker.addTo(map.current);
        markersRef.current = [...markersRef.current, marker];
        // updateMarkersState(markersRef, setMarkers);
      }
    });
    return markersRef.current;
  }
};

export default function App() {
  const markersRef = useRef([]);
  const locations = [
    "Great Wall of China",
    "Taj Mahal",
    "Grand Canyon",
    "Eiffel Tower",
    "Great Barrier Reef",
    "Pyramids of Giza",
    "Venice",
    "Santorini",
    "Serengeti National Park",
    "Angkor Wat",
    "Banff National Park",
    "Mount Everest",
    "Galápagos Islands",
    "Petra",
    "Iguazu Falls",
    "Antelope Canyon",
    "The Louvre",
    "Plitvice Lakes National Park",
    "Bali",
  ];
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(() => {
    const lngLocalStorage = localStorage.getItem("lng");
    if (lngLocalStorage) return JSON.parse(lngLocalStorage);
    return 12;
  });
  const [lat, setLat] = useState(() => {
    const latLocalStorage = localStorage.getItem("lat");
    if (latLocalStorage) return JSON.parse(latLocalStorage);
    return 41;
  });
  const [zoom, setZoom] = useState(() => {
    const zoomLocalStorage = localStorage.getItem("zoom");
    if (zoomLocalStorage) return JSON.parse(zoomLocalStorage);
    return 7;
  });
  const [markers, setMarkers] = useState(() => {
    return loadLocalStorageMarkers(markersRef);
  });

  const [isDataFetching, setIsDataFetching] = useState(false);
  const [componentVisibility, setComponentVisibility] = useState(() => {
    const componentVisibilityLocalStorage = localStorage.getItem(
      "componentsVisibility"
    );
    if (componentVisibilityLocalStorage)
      return JSON.parse(componentVisibilityLocalStorage);

    return {
      markerBrowser: true,
      searchbar: true,
      navigationBar: true,
      positionalInfo: true,
      componentMenu: true,
    };
  });

  let isDarkMode = false;
  let mapStyle = isDarkMode
    ? "mapbox://styles/mapbox/dark-v11"
    : "mapbox://styles/mapbox/streets-v12";

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom,
      trackResize: true,
    });

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    map.current.on("load", () => {
      markersRef.current.map((marker) => {
        marker.marker
          .getElement()
          .addEventListener("click", () => markerOpenPopup(marker));
        marker.marker.addTo(map.current);
      });
      loadLocationsOnStart(locations);
    });

    // setIsDataFetching(true);
    // Promise.resolve()
    //   .then(() => {})
    //   .catch((error) => {
    //     console.error("Error loading locations on start ", error);
    //   })
    //   .finally(() => {
    //     setIsDataFetching(false);
    //   });

    map.current.on("mousedown", (e) => {
      if (e.originalEvent.button === 2) addPopupOnMapRightClick(e);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "componentsVisibility",
      JSON.stringify(componentVisibility)
    );
  }, [componentVisibility]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      localStorage.setItem("lng", JSON.stringify(lng));
      localStorage.setItem("lat", JSON.stringify(lat));
      localStorage.setItem("zoom", JSON.stringify(zoom));
    }, 2000);

    return () => clearTimeout(timerId);
  }, [lng, lat, zoom]);

  useEffect(() => {
    const deserializedMarkers = markersRef.current.map(
      ({ name, lng, lat, id }) => ({ name, lng, lat, id })
    );
    localStorage.setItem("markers", JSON.stringify(deserializedMarkers));
  }, [markersRef.current]);

  const handlePopupClickAddMarker = (lng, lat, popup) => {
    const popupInput = document.getElementById("popupInput");
    if (popupInput) {
      const inputValue = popupInput.value;
      addMarkerFromPopup(inputValue, lng, lat);
      popup.remove();
    }
  };

  const loadLocationsOnStart = (locations) => {
    let index = 0;
    const fetchInterval = setInterval((async) => {
      if (index >= locations.length) {
        clearInterval(fetchInterval);
        return;
      }

      addMarkerFromApi(locations[index]);
      index++;

      if (index < locations[index + 1]) {
        addMarkerFromApi[index];
        index++;
      }
    }, 500);
  };

  const updateMarkersState = (markersRef, setMarkers) => {
    setMarkers(markersRef.current);
  };

  const addPopupOnMapRightClick = (e) => {
    const popup = new mapboxgl.Popup({
      closeOnClick: true,
      closeOnMove: true,
    }).setLngLat([e.lngLat.lng, e.lngLat.lat]).setHTML(`
    <div>
      <p>Lng: ${e.lngLat.lng}</p>
      <p>Lat: ${e.lngLat.lat}</p>
      <input id="popupInput" type="text"/>
      <button id="addMarker">Add marker</button>
    </div>`);

    const popupAddMarker = () =>
      handlePopupClickAddMarker(e.lngLat.lng, e.lngLat.lat, popup);

    popup.on("open", () => {
      const addMarkerButton = document.getElementById("addMarker");
      if (addMarkerButton)
        addMarkerButton.addEventListener("click", popupAddMarker);
    });

    popup.on("close", () => {
      const addMarkerButton = document.getElementById("addMarker");
      if (addMarkerButton)
        addMarkerButton.removeEventListener("click", popupAddMarker);
    });

    popup.addTo(map.current);
  };

  const centerFromPopup = (marker) => {
    map.current.flyTo({
      center: marker.marker.getLngLat(),
      zoom: 7,
      essential: false,
    });
  };

  const deleteMarkerFromPopup = (markerToDelete, popup) => {
    popup.remove();
    markerToDelete.marker
      .getElement()
      .removeEventListener("click", markerOpenPopup);
    markerToDelete.marker.remove();
    markersRef.current = markersRef.current.filter(
      (marker) => marker.id !== markerToDelete.id
    );
    updateMarkersState(markersRef, setMarkers);
  };

  const createPopupHTML = (marker) => {
    return `<div>
        <h3> ${marker.name} </h3>
        <p>Lng: ${marker.lng} </p>
        <p>Lat: ${marker.lat} </p>
        <button id="centerButton">Center and zoom</button>
        <button id="deleteButton">Delete</button>
      </div>`;
  };

  const markerOpenPopup = (marker) => {
    const popupContent = createPopupHTML(marker);

    const popup = new mapboxgl.Popup({ closeOnClick: false, closeOnMove: true })
      .setLngLat([marker.lng, marker.lat])
      .setHTML(popupContent);

    const popupCenterButtonHandler = () => centerFromPopup(marker);
    const popupDeleteButtonHandler = () => deleteMarkerFromPopup(marker, popup);

    popup.on("open", () => {
      const centerMarkerButton = document.getElementById("centerButton");
      const deleteMarkerButton = document.getElementById("deleteButton");

      if (centerMarkerButton)
        centerMarkerButton.addEventListener("click", popupCenterButtonHandler);
      if (deleteMarkerButton)
        deleteMarkerButton.addEventListener("click", popupDeleteButtonHandler);
    });

    popup.on("close", () => {
      const centerMarkerButton = document.getElementById("centerButton");
      const deleteMarkerButton = document.getElementById("deleteButton");

      if (centerMarkerButton)
        centerMarkerButton.removeEventListener(
          "click",
          popupCenterButtonHandler
        );
      if (deleteMarkerButton)
        deleteMarkerButton.removeEventListener(
          "click",
          popupDeleteButtonHandler
        );
    });

    popup.addTo(map.current);
  };

  const addMarkerFromApi = async (address) => {
    const url = `https://us1.locationiq.com/v1/search.php?key=${apikey}&q=${encodeURIComponent(
      address
    )}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data[0])
        addMarker(data[0], map, markersRef, updateMarkersState, setMarkers);
    } catch (error) {
      console.error("Error fetching data from API: ", error, data[0]);
    }
  };

  const addMarker = (
    apiResponseData,
    map,
    markersRef,
    updateMarkersState,
    setMarkers
  ) => {
    const newMarker = {
      name: apiResponseData.display_name,
      marker: new mapboxgl.Marker({ className: "marker" }).setLngLat([
        parseFloat(apiResponseData.lon),
        parseFloat(apiResponseData.lat),
      ]),
      id: apiResponseData.place_id,
      lng: apiResponseData.lon,
      lat: apiResponseData.lat,
    };

    const doesExist = markersRef.current.some(
      (marker) => marker.id === newMarker.id
    );
    if (!doesExist) {
      markersRef.current = [...markersRef.current, newMarker];
      newMarker.marker
        .getElement()
        .addEventListener("click", () => markerOpenPopup(newMarker));
      newMarker.marker.addTo(map.current);
      updateMarkersState(markersRef, setMarkers);
    }
  };

  const addMarkerFromPopup = (name, lng, lat) => {
    const newMarker = {
      name: name,
      marker: new mapboxgl.Marker({ className: "marker" }).setLngLat([
        lng,
        lat,
      ]),
      id: uuidv4(),
      lng: lng,
      lat: lat,
    };
    markersRef.current = [...markersRef.current, newMarker];
    updateMarkersState(markersRef, setMarkers);
    newMarker.marker.addTo(map.current);
    newMarker.marker
      .getElement()
      .addEventListener("click", () => markerOpenPopup(newMarker));
  };

  return (
    <>
      <div ref={mapContainer} className="map-container"></div>

      {componentVisibility.positionalInfo ? (
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      ) : null}

      {componentVisibility.searchbar ? (
        <Searchbar
          apikey={apikey}
          map={map}
          markersRef={markersRef}
          updateMarkersState={updateMarkersState}
          setMarkers={setMarkers}
          addMarker={addMarker}
        />
      ) : null}

      {componentVisibility.markerBrowser ? (
        <MarkerBrowser
          map={map}
          isDataFetching={isDataFetching}
          markerOpenPopup={markerOpenPopup}
          markersRef={markersRef}
          updateMarkersState={updateMarkersState}
          markers={markers}
          setMarkers={setMarkers}
        ></MarkerBrowser>
      ) : null}

      {componentVisibility.navigationBar ? <NavigationBar map={map} /> : null}

      <ComponentMenu
        componentVisibility={componentVisibility}
        setComponentVisibility={setComponentVisibility}
      />
    </>
  );
}
