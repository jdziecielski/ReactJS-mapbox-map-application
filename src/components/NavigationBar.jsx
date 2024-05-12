import { useRef } from "react"

export default function NavigationBar({map}) {
    const lngRef = useRef(0);
    const latRef = useRef(0);

    const handleClick = () => {
        console.log(lngRef.current.value, latRef.current.value);
        map.current.flyTo({ center: [lngRef.current.value, latRef.current.value] })
    }

    const handleInputChange = (event) => {
        // Regex to allow only numbers and hyphen
        const validChars = /^[-\d.]*$/
        const { value } = event.target;
        if (value === '' || validChars.test(value)) {
            event.target.value = value;
        } else {
            event.target.value = value.slice(0, -1); // Remove last invalid character
        }
    };

    return (
        <div className="navigation-bar">
            <input type="text"
                ref={lngRef}
                placeholder="LNG"
                className="navigation-input"
                onChange={handleInputChange}
                />
            <input type="text" 
                ref={latRef}
                placeholder="LAT"
                className="navigation-input"
                onChange={handleInputChange}
            />
            <button 
                className="navigation-button"
                onClick={handleClick}
            >
                Center
            </button>
        </div>        
    )
}