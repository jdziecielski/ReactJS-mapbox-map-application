import { useEffect, useState, useRef } from "react"
import eye_icon from "../assets/eye_icon.png"
import plus_icon from "../assets/plus-icon.png"
import check_icon from "../assets/check-icon.png"

export default function Searchbar({apikey, map, markersRef, updateMarkersState, setMarkers, addMarker}) {
    const [placeholder, setPlaceholder] = useState('Enter location...');
    const [searchQuery, setSearchQuery] = useState("");
    const [queryResponses, setQueryResponses] = useState([]);
    const [areQueriesDisplayed, setAreQueriesDisplayed] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isDataFetching, setIsDataFetching] = useState(false);
    const fetchDelay = 500
    const searchbarRef = useRef(null);
    
    const fetchData = async () => {
        try {
            const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${apikey}&q=${encodeURIComponent(searchQuery)}&format=json`)
            if (!response.ok) console.error("Promise was not ok!");
            const data = await response.json();
            setQueryResponses(data);
        } catch (error) { console.error(`Error: ${error}`); }
    }

    const viewLocation = (response) => {
        map.current.flyTo({ center: [response.lon, response.lat], zoom: 14})
        setAreQueriesDisplayed(false)
    }

    const handleFocus = () => {
        setPlaceholder('')
        setAreQueriesDisplayed(true)
    }

    const alertAddingDuplicateMarker = () => {
        setPopupMessage("Location already added!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);   
    }

    useEffect(() => {
        if (searchQuery.length !== 0) {
            setIsDataFetching(true)
            const timerId = setTimeout(() => {
                fetchData();
                setIsDataFetching(false)
            }, fetchDelay);

            return () => clearTimeout(timerId);
        }
    }, [searchQuery]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchbarRef.current && !searchbarRef.current.contains(event.target)) setAreQueriesDisplayed(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); }
    }, [])

    return (
        <div className="searchbar" ref={searchbarRef}>
            <input 
                type="text" 
                placeholder={placeholder} 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                onFocus={handleFocus}
                onBlur={() => {if (searchQuery === '') setPlaceholder('Enter location...');}}
                className="searchbar-input"
            />

            {isDataFetching ? (
                <ul className="searchbar-ul">
                    <li className="searchbar-li-data-info">Loading data...</li>
                </ul>
            ) : (
                (areQueriesDisplayed && searchQuery.length) ? (
                    queryResponses.length ? (
                        <ul className="searchbar-ul">
                            {queryResponses.map(response => (
                                <li key={response.place_id} className="searchbar-li">
                                    {markersRef.current.some(marker => marker.id === response.place_id) ? (
                                        <img src={check_icon} alt="check icon" className="icon-searchbar" onClick={alertAddingDuplicateMarker} />
                                    ) : (
                                        <img src={plus_icon} alt="plus icon" className="icon-searchbar" onClick={() => addMarker(response, map, markersRef, updateMarkersState, setMarkers)} />
                                    )}
                                    <img src={eye_icon} alt="eye icon" className="icon-searchbar" onClick={() => viewLocation(response)} />
                                    {response.display_name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <ul className="searchbar-ul">
                            <li className="searchbar-li-data-info">No results for: {searchQuery}</li>
                        </ul>
                    )
                ) : null
            )}
        

            {showPopup && <div className={`popup ${showPopup ? 'show' : ''}`}>{popupMessage}</div>}
        </div>
        
    )
}