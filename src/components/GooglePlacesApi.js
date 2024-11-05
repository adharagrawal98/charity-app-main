// SearchLocationInput.js
import React, { useEffect, useRef, useState } from "react";

// Function to load the Google Maps script
const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const SearchLocationInput = ({ setSelectedLocation, setSelectedAddress }) => {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);
  const googleMapsApiKey = 'REACT_APP_GOOGLE_MAPS_KEY'; // Replace with your actual API key

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    const autoComplete = new window.google.maps.places.Autocomplete(
      autoCompleteRef.current,
      { componentRestrictions: { country: "GB" } }
    );

    autoComplete.addListener("place_changed", () => {
      const addressObject = autoComplete.getPlace();
      const formattedAddress = addressObject.formatted_address;

      if (addressObject.geometry) {
        const latLng = {
          lat: addressObject.geometry.location.lat(),
          lng: addressObject.geometry.location.lng(),
        };

        updateQuery(formattedAddress);
        setSelectedAddress(formattedAddress);
        setSelectedLocation(latLng);
      }
    });
  };

  useEffect(() => {
    if (!window.google) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${'AIzaSyAQcmhvqFdbtCb9L7FIRII4PNY4Tv8MTFI'}&libraries=places`,
        () => handleScriptLoad(setQuery, autoCompleteRef)
      );
    } else {
      handleScriptLoad(setQuery, autoCompleteRef);
    }
  }, []);

  return (
    <div className="search-location-input">
      <label>Type in your suburb or postcode</label>
      <input
        ref={autoCompleteRef}
        className="form-control ml-5"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search Places ..."
        value={query}
      />
    </div>
  );
};

export default SearchLocationInput;