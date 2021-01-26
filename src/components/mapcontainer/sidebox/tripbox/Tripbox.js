import React, {useEffect, useRef} from "react";
import './Tripbox.css'
import {ReactComponent as StartMarker} from '../../../../images/start_marker.svg';
import {ReactComponent as EndMarker} from '../../../../images/end_marker.svg';
import {ReactComponent as Balls} from '../../../../images/balls.svg';

function Tripbox(props){

    const autocompleteOrigin = useRef(null)
    const autocompleteDestination = useRef(null)

    const originChanged = () => {
        props.updateMapCenter({
            lat: autocompleteOrigin.current.getPlace().geometry.location.lat(),
            lng: autocompleteOrigin.current.getPlace().geometry.location.lng()
        })
        props.setOrigin(autocompleteOrigin.current.getPlace().adr_address)
    }

    const destinationChanged = () => {
        props.setDestination(autocompleteDestination.current.getPlace().adr_address)
    }

    useEffect(() => {
        if(props.scriptLoaded){
            const originInput = document.getElementById('originInput')
            autocompleteOrigin.current = new window.google.maps.places.Autocomplete(originInput, {componentRestrictions: {'country': ['us']}, fields: ['adr_address', 'geometry', 'formatted_address']})
            autocompleteOrigin.current.addListener("place_changed", originChanged);

            const destinationInput = document.getElementById('destinationInput');
            autocompleteDestination.current = new window.google.maps.places.Autocomplete(destinationInput, {componentRestrictions: {'country': ['us']}, fields: ['adr_address', 'formatted_address']})
            autocompleteDestination.current.addListener("place_changed", destinationChanged);

        }
        // eslint-disable-next-line
    }, [props.scriptLoaded])

    return (
        <div className="Tripbox-Conatiner">
            <input id="originInput" type="text" placeholder="Origin" className="Destination Start"/>
            <input id="destinationInput" type="text" placeholder="Destination" className="Destination End"/>
            <hr className="Start-Line"></hr>
            <hr className="End-Line"></hr>
            <StartMarker className="Start-Marker" />
            <EndMarker className="End-Marker" />
            <Balls className="Balls" style={{top: "49px"}} />
            <Balls className="Balls" style={{top: "63px"}} />
        </div>
    )

}

export default Tripbox;