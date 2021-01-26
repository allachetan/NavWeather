import React, {useEffect, useState} from "react";
import {ReactComponent as Car} from '../../../../images/car.svg';
import {ReactComponent as Warning} from '../../../../images/warning.svg';
import './RouteDetails.css'

function RouteDetails(props){

    const [containerClassExtension, setContainerClassExtension] = useState(" Closed")
    const [weatherButton, setWeatherButton] = useState("WEATHER DETAILS")
    const [weatherClassExtension, setWeatherClassExtension] = useState(" Hidden")
    const [precipitationAmountColor, setPrecipitationAmountColor] = useState('#4F4F4F')
    const [precipitationChanceColor, setPrecipitationChanceColor] = useState('#4F4F4F')
    const [iceAccumulationColor, setIceAccumulationColor] = useState('#4F4F4F')
    const [windSpeedColor, setWindSpeedColor] = useState('#4F4F4F')
    const [warning, setWarning] = useState(false)

    const containerClassName = (props.highlighted) ? "Route-Details-Container Highlighted" : "Route-Details-Container"

    const updateHighlighted = () => {
        props.setHighlighted(props.index)
    }

    const weatherDetails = (event) => {
        if(containerClassExtension === " Closed" && props.weather.length > props.index && props.highlighted){
            setContainerClassExtension(" Opened")
            setWeatherClassExtension("")
            setWeatherButton("CLOSE WEATHER DETAILS")
        }else if(containerClassExtension === " Opened"){
            setContainerClassExtension(" Closed")
            setWeatherClassExtension(" Hidden")
            setWeatherButton("WEATHER DETAILS")
        }
    }

    useEffect(() => {
        if(props.weather.length > props.index){
            let weatherWarning = false
            setPrecipitationAmountColor('#4F4F4F')
            setPrecipitationChanceColor('#4F4F4F')
            setIceAccumulationColor('#4F4F4F')
            setWindSpeedColor('#4F4F4F')
            if(props.weather[props.index].precipitationAmount >= 1.2 ){
                setPrecipitationAmountColor('#FF3333')
                weatherWarning = true
            }else if(props.weather[props.index].precipitationAmount >= 0.4){
                setPrecipitationAmountColor('#B06000')
                weatherWarning = true
            }
            if(props.weather[props.index].precipitationChance > 50){
                setPrecipitationChanceColor('#B06000')
                weatherWarning = true
            }
            if(props.weather[props.index].iceAccumulation > 0.25){
                setIceAccumulationColor('#FF3333')
                weatherWarning = true
            }
            if(props.weather[props.index].windSpeed >= 30){
                setWindSpeedColor('#FF3333')
                weatherWarning = true
            }else if(props.weather[props.index].windSpeed > 15){
                setWindSpeedColor('#B06000')
                weatherWarning = true
            }
            setWarning(weatherWarning)
        }else{
            setWarning(false)
        }
        // eslint-disable-next-line
    }, [props.weather])

    useEffect(() => {
        if(props.weather.length > props.index){
            setWeatherButton("WEATHER DETAILS")
        }else{
            setWeatherButton("LOADING WEATHER")
            setContainerClassExtension(" Closed")
            setWeatherClassExtension(" Hidden")
        }
        // eslint-disable-next-line
    }, [props.weather])

    useEffect(() => {
        if(props.highlighted === false && containerClassExtension === " Opened"){
            setContainerClassExtension(" Closed")
            setWeatherClassExtension(" Hidden")
            setWeatherButton("WEATHER DETAILS")
        }
        // eslint-disable-next-line
    }, [props.highlighted])

    return (
        <div className={containerClassName + containerClassExtension} onClick={(props.index === props.highlighted ? true : false) ? undefined : updateHighlighted}>
            <Car className="Car"/>
            <p className="Text Summary">via {props.routeDetails.summary}</p>
            <p className="Text Time">{props.routeDetails.time}</p>
            {
                warning && (
                    <Warning className="Warning-Sign"/>
                )
            }
            {
                warning ? (
                    <p className="Text Warning">Inclement weather along route!</p>
                ) : (
                    <p className="Text Normal">Normal weather conditions</p>
                )
            }
            <p className="Text Miles">{props.routeDetails.miles}</p>
            <div className="Details-Container" onClick={weatherDetails}>
                <p className="Text Details">{weatherButton}</p>
            </div>

            <p className={"Temperature" + weatherClassExtension}>{(props.weather.length > props.index) ? props.weather[props.index].temp : 0}°F</p>

            <p className={"Weather-Header" + weatherClassExtension} style={{top: '155px', left: '48px'}}>Precipitation</p>
            <p className={"Weather-Header" + weatherClassExtension} style={{top: '155px', left: '210px'}}>Precipitation Chance</p>
            <p className={"Weather-Header" + weatherClassExtension} style={{top: '210px', left: '48px'}}>Ice Accumulation</p>
            <p className={"Weather-Header" + weatherClassExtension} style={{top: '210px', left: '210px'}}>Wind Speed</p>

            <p className={"Weather-Info" + weatherClassExtension} style={{top: '180px', left: '71px', color: precipitationAmountColor}}>{(props.weather.length > props.index) ? props.weather[props.index].precipitationAmount : 0} in</p>
            <p className={"Weather-Info" + weatherClassExtension} style={{top: '180px', left: '223px', color: precipitationChanceColor}}>{(props.weather.length > props.index) ? props.weather[props.index].precipitationChance : 0}%</p>
            <p className={"Weather-Info" + weatherClassExtension} style={{top: '235px', left: '71px', color: iceAccumulationColor}}>{(props.weather.length > props.index) ? props.weather[props.index].iceAccumulation : 0} in</p>
            <p className={"Weather-Info" + weatherClassExtension} style={{top: '235px', left: '223px', color: windSpeedColor}}>{(props.weather.length > props.index) ? props.weather[props.index].windSpeed : 0} mph</p>

            <p className={"Instructions" + weatherClassExtension} >hover over route to see more details</p>
        </div>
    )

}

export default RouteDetails