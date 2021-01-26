import React, {useEffect, useState} from "react";
import Sidebox from "./sidebox/Sidebox";
import Map from "./map/Map";
import * as Constants from '../constants'

function MapContainer(props){

    const [center, setCenter]= useState({
        lat: 38.907,
        lng: -77.036
    })
    const [mapWidth, setMapWidth] = useState('calc(100vw - 408px)')
    const [destination, setDestination] = useState(null)
    const [origin, setOrigin] = useState(null)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [routeDetails, setRouteDetails] = useState([])
    const [highlighted, setHighlighted] = useState(0)
    const [date, setDate] = useState(new Date())
    const [avoidHighways, setAvoidHighways] = useState(false)
    const [avoidTolls, setAvoidTolls] = useState(false)
    const [avoidFerries, setAvoidFerries] = useState(false)
    // summary of weather along the route shown in route details
    const [weather, setWeather] = useState([])

    const updateMapDimensions = (sideboxClosed) => {
        if(sideboxClosed){
            setMapWidth('100vw')
        }else{
            setMapWidth('calc(100vw - 408px)')
        }
    }

    useEffect(() => {
        if (!window.google) {
            let s = document.createElement("script");
            s.type = "text/javascript";
            s.src = 'https://maps.google.com/maps/api/js?key=' + Constants.mapsApiKey + '&libraries=' + Constants.libraries;
            let x = document.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
            s.addEventListener("load", e => {
                setScriptLoaded(true)
            });
        } else if(!scriptLoaded){
            setScriptLoaded(true)
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div>
            <Map
                scriptLoaded={scriptLoaded}
                center={center}
                mapWidth={mapWidth}
                destination={destination}
                origin={origin}
                updateRouteDetails={setRouteDetails}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                date={date}
                avoidTolls={avoidTolls}
                avoidHighways={avoidHighways}
                avoidFerries={avoidFerries}
                setWeather={setWeather} />
            <Sidebox
                scriptLoaded={scriptLoaded}
                updateMapCenter={setCenter}
                updateMapDimensions={updateMapDimensions}
                setDestination={setDestination}
                setOrigin={setOrigin}
                routeDetails={routeDetails}
                highlighted={highlighted}
                setHighlighted={setHighlighted}
                date={date}
                setDate={setDate}
                avoidTolls={avoidTolls}
                setAvoidTolls={setAvoidTolls}
                avoidHighways={avoidHighways}
                setAvoidHighways={setAvoidHighways}
                avoidFerries={avoidFerries}
                setAvoidFerries={setAvoidFerries}
                weather={weather} />
        </div>
    )

}

export default MapContainer;