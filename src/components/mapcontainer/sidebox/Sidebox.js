import React, {useState} from "react";
import Tripbox from "./tripbox/Tripbox";
import Options from "./options/Options";
import './Sidebox.css'
import leftIcon from '../../../images/left.png'
import rightIcon from '../../../images/right.png'
import RouteDetails from "./routedetails/RouteDetails";

function Sidebox(props){

    const [sideboxClass, setSideboxClass] = useState('Sidebox-Container')

    const handleClick = (event) => {
        event.preventDefault();
        if(sideboxClass === 'Sidebox-Container'){
            setSideboxClass('Sidebox-Container Hidden-Container')
            props.updateMapDimensions(true);
        }else{
            setSideboxClass('Sidebox-Container')
            props.updateMapDimensions(false);
        }
    }

    let routeDetailsList = []
    for(let i = 0; i < props.routeDetails.length; i ++){
        routeDetailsList.push(
            <RouteDetails
                key={i}
                index={i}
                routeDetails={props.routeDetails[i]}
                highlighted={i === props.highlighted ? true : false}
                setHighlighted={props.setHighlighted}
                weather={props.weather}
            />)
    }

    return (
        <div className={sideboxClass}>
            <Tripbox
                scriptLoaded={props.scriptLoaded}
                updateMapCenter={props.updateMapCenter}
                setDestination={props.setDestination}
                setOrigin={props.setOrigin} />
            <Options
                date={props.date}
                setDate={props.setDate}
                avoidTolls={props.avoidTolls}
                setAvoidTolls={props.setAvoidTolls}
                avoidHighways={props.avoidHighways}
                setAvoidHighways={props.setAvoidHighways}
                avoidFerries={props.avoidFerries}
                setAvoidFerries={props.setAvoidFerries} />
            <div
                className="Close-Button"
                onClick={handleClick} >
                <img className="Close-Image" src={sideboxClass === 'Sidebox-Container' ? leftIcon : rightIcon} alt="close"/>
            </div>
            {routeDetailsList}
        </div>
    )

}

export default Sidebox;