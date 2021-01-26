import React, {useEffect, useRef} from "react";

function Map(props){

    const map = useRef(null)
    const directionsService = useRef(null)
    const directionsRenderer = useRef(null)
    const coloredRoutes = useRef([])

    // init map
    useEffect(() => {
        if(props.scriptLoaded){
            map.current = new window.google.maps.Map(document.getElementById("map"), {
                center: props.center,
                zoom: 10,
                mapTypeControlOptions: {position: 2},
            });
            directionsService.current = new window.google.maps.DirectionsService()
            directionsRenderer.current = new window.google.maps.DirectionsRenderer()
            directionsRenderer.current.setMap(map.current)
            directionsRenderer.current.setOptions({
                polylineOptions: {
                    visible: false
                }
            })
        }
        // eslint-disable-next-line
    }, [props.scriptLoaded])

    // update center
    useEffect(() => {
        if(map.current != null){
            map.current.setCenter(props.center)
        }
    }, [props.center])

    // display route
    useEffect(() => {
        if(props.origin !== null && props.destination !== null){
            const deptTime = (props.date > new Date()) ? props.date : new Date()
            const request = {
                origin: props.origin,
                destination: props.destination,
                travelMode: 'DRIVING',
                drivingOptions: {
                    departureTime: deptTime,
                },
                avoidTolls: props.avoidTolls,
                avoidHighways: props.avoidHighways,
                avoidFerries: props.avoidFerries,
                provideRouteAlternatives: true,
            }
            directionsService.current.route(request, (result, status) => {
                if(status === 'OK'){
                    directionsRenderer.current.setDirections(result)
                    // remove existing routes
                    removeExistingRoutes()
                    coloredRoutes.current = []
                    // create new routes
                    let routeDetails = []
                    let weatherLines = []
                    for(let i = 0; i < result.routes.length; i ++){
                        // populate route details
                        routeDetails.push({
                            summary: result.routes[i].summary,
                            time: result.routes[i].legs[0].duration.text,
                            miles: result.routes[i].legs[0].distance.text + 'les',
                        })

                        weatherLines.push(drawColoredLine(result.routes[i].overview_path, deptTime, result.routes[i].legs[0].duration.value, i, result.routes.length))
                    }
                    createWeatherSummary(weatherLines)
                    props.updateRouteDetails(routeDetails)
                    props.setHighlighted(0)
                }
            })
        }
        // eslint-disable-next-line
    }, [props.origin, props.destination, props.date, props.avoidTolls, props.avoidHighways, props.avoidFerries])

    // highlight route
    useEffect(() => {
        for(let i = 0; i < coloredRoutes.current.length; i ++){
            if(i === props.highlighted){
                for(let j = 0; j < coloredRoutes.current[i].length; j ++){
                    coloredRoutes.current[i][j].setOptions({
                        zIndex: 5,
                        strokeColor: (coloredRoutes.current[i][j].get('color') === undefined) ? '#3364FF' : coloredRoutes.current[i][j].get('color')
                    })
                }
            }else{
                for(let j = 0; j < coloredRoutes.current[i].length; j ++){
                    coloredRoutes.current[i][j].setOptions({
                        zIndex: 1,
                        strokeColor: 'grey'
                    })
                }
            }
        }
    }, [props.highlighted])

    // draw broken line
    const drawColoredLine = (overview_path, deptTime, duration, index) => {
        let coloredLine = []
        // data to push into async method to collect weather data
        let weatherLines = []

        let start_lat = overview_path[0].lat()
        let start_lng = overview_path[0].lng()
        let currentPath = [overview_path[0]]
        for(let i = 1; i < overview_path.length; i ++){
            currentPath.push(overview_path[i])
            const lat = overview_path[i].lat()
            const lng = overview_path[i].lng()
            if(distance(start_lat, start_lng, lat, lng) >= 30){
                start_lat = lat;
                start_lng = lng;

                // draw line and add to map
                const polyline = new window.google.maps.Polyline({
                    path: currentPath,
                    strokeWeight: 6,
                    strokeColor: (index === 0) ? '#3364FF' : 'grey',
                    zIndex: (index === 0) ? 5 : 1,
                })
                polyline.setMap(map.current)
                polyline.set('index', index)
                polyline.addListener("click", function(event){
                    props.setHighlighted(this.get('index'))
                })
                coloredLine.push(polyline)

                // get weather
                const locationCords = currentPath[Math.floor(currentPath.length / 2)]
                const locationTime = new Date(Math.round((deptTime.getTime() + (i - Math.ceil(currentPath.length / 2.0)) / overview_path.length * duration * 1000) / 60 / 60 / 1000 ) * 60 * 60 * 1000)
                weatherLines.push({
                    locationCords: locationCords,
                    locationTime: locationTime,
                    polyline: polyline
                })

                currentPath = []
                currentPath.push(overview_path[i])
            }
        }

        const polyline = new window.google.maps.Polyline({
            path: currentPath,
            strokeWeight: 6,
            strokeColor: (index === 0) ? '#3364FF' : 'grey',
            zIndex:  (index === 0) ? 5 : 1,
        })
        polyline.setMap(map.current)
        polyline.set('index', index)
        polyline.addListener("click", function(event){
            props.setHighlighted(this.get('index'))
        })

        coloredLine.push(polyline)
        coloredRoutes.current.push(coloredLine)

        // get weather
        const locationCords = currentPath[Math.floor(currentPath.length / 2)]
        const locationTime = new Date(Math.round((deptTime.getTime() + (overview_path.length - Math.ceil(currentPath.length / 2.0)) / overview_path.length * duration * 1000) / 60 / 60 / 1000 ) * 60 * 60 * 1000)
        weatherLines.push({
            locationCords: locationCords,
            locationTime: locationTime,
            polyline: polyline
        })
        //addWeatherToLines(weatherLines, index, maxLength)
        return weatherLines
    }

    // get distance between coordinates
    const distance = (lat1, lon1, lat2, lon2) => {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            const radlat1 = Math.PI * lat1/180;
            const radlat2 = Math.PI * lat2/180;
            const theta = lon1-lon2;
            const radtheta = Math.PI * theta/180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            return dist;
        }
    }

    const createWeatherSummary = async (lines) => {
        let weatherSummary = []
        for(let i = 0; i < lines.length; i ++){
            let totalWeather = {
                temp: 0,
                precipitationAmount: 0,
                precipitationChance: 0,
                iceAccumulation: 0,
                windSpeed: 0,
            }
            for(let j = 0; j < lines[i].length; j ++){
                const weather = await getWeather(lines[i][j].locationCords, lines[i][j].locationTime, lines[i][j].polyline)
                totalWeather = {
                    temp: (totalWeather.temp + weather.avgTemp),
                    precipitationAmount: (totalWeather.precipitationAmount < weather.precipitationAmount) ? weather.precipitationAmount : totalWeather.precipitationAmount,
                    precipitationChance: (totalWeather.precipitationChance < weather.precipitationChance) ? weather.precipitationChance : totalWeather.precipitationChance,
                    iceAccumulation: (totalWeather.iceAccumulation < weather.iceAccumulation) ? weather.iceAccumulation : totalWeather.iceAccumulation,
                    windSpeed: (totalWeather.windSpeed < weather.windSpeed) ? weather.windSpeed : totalWeather.windSpeed,
                }
            }
            weatherSummary.push({
                temp: Math.round(totalWeather.temp / lines[i].length),
                precipitationAmount: Math.round(totalWeather.precipitationAmount * 100) / 100,
                precipitationChance: Math.round(totalWeather.precipitationChance),
                iceAccumulation: Math.round(totalWeather.iceAccumulation * 100) / 100,
                windSpeed: Math.round(totalWeather.windSpeed),
            })
        }
        props.setWeather(weatherSummary)
    }

    const getWeather = async (locationCords, locationTime, polyline) => {
        const gridpointResponse = await fetch('https://api.weather.gov/points/' + locationCords.lat() + ',' + locationCords.lng())
        const gridpointData = await gridpointResponse.json()
        let weatherResponse = await fetch(gridpointData.properties.forecastGridData)
        let data = await weatherResponse.json()
        while(data.status === 500){
            weatherResponse = await fetch(gridpointData.properties.forecastGridData)
            data = await weatherResponse.json()
        }

        let weather = {
            colorIndex: 0,
            avgTemp: Math.round(getWeatherDataValues(data.properties.temperature.values, locationTime, true) * 9/5 + 32),
            iceAccumulation: Math.round(getWeatherDataValues(data.properties.iceAccumulation.values, locationTime, false) / 25.4 * 100) / 100,
            windSpeed: Math.round(getWeatherDataValues(data.properties.windSpeed.values, locationTime, true) / 1.609),
            precipitationChance: Math.round(getWeatherDataValues(data.properties.probabilityOfPrecipitation.values, locationTime, false)),
            precipitationAmount: Math.round(getWeatherDataValues(data.properties.quantitativePrecipitation.values, locationTime, true) * 4 / 25.4 * 100) / 100,
        }

        // set color index and text colors to be used in the line color and info box
        let iceAccumulationColor = "#4F4F4F"
        let windSpeedColor = "#4F4F4F"
        let precipitationChanceColor = "#4F4F4F"
        let precipitationAmountColor = "#4F4F4F"
        if(weather.iceAccumulation >= 0.25){
            weather.colorIndex = 2
            iceAccumulationColor = "#FF3333"
        }
        if(weather.windSpeed > 15){
            if(weather.windSpeed >= 30){
                weather.colorIndex = 2
                windSpeedColor = "#FF3333"
            }else {
                weather.colorIndex = 1
                windSpeedColor = "#B06000"
            }
        }
        if(weather.precipitationChance > 50){
            weather.colorIndex = 1
            precipitationChanceColor = "#B06000"
        }
        if(weather.precipitationAmount >= 0.4){
            if(weather.precipitationAmount >= 1.2){
                weather.colorIndex = 2
                precipitationAmountColor = "#FF3333"
            }else {
                weather.colorIndex = 1
                precipitationAmountColor = "#B06000"
            }
        }

        const colors = ["#3364FF", "#fcf044", "red"]
        if(polyline.get("index") === 0){
            // set line color
            polyline.setOptions({
                strokeColor: colors[weather.colorIndex],
            })
        }
        polyline.set('color', colors[weather.colorIndex])

        // add info box
        const content =
            "<div style='position: relative; width: 210px; height: 130px;'>" +
            "<p style='position: absolute; margin: 0px; width: 105px; height: 50px; font-weight: bold; vertical-align: middle; font-size: 36px; color: #4F4F4F; text-align: left;'>" + weather.avgTemp + "°F</p>" +
            "<p style='position: absolute; margin: 0px; top: 49px; width: 105px; height: 12px; font-weight: bold; vertical-align: middle; font-size: 11px; color: #4F4F4F; text-align: left;'>Precipitation</p>" +
            "<p style='position: absolute; margin: 0px; left: 105px; top: 49px; width: 105px; height: 12px; font-weight: bold; vertical-align: middle; font-size: 11px; color: #4F4F4F; text-align: left;'>Precipitation Chance</p>" +
            "<p style='position: absolute; margin: 0px; top: 91px; width: 105px; height: 12px; font-weight: bold; vertical-align: middle; font-size: 11px; color: #4F4F4F; text-align: left;'>Ice Accumulation</p>" +
            "<p style='position: absolute; margin: 0px; left: 105px; top: 91px; width: 105px; height: 12px; font-weight: bold; vertical-align: middle; font-size: 11px; color: #4F4F4F; text-align: left;'>Wind Speed</p>" +
            "<p style='position: absolute; margin: 0px; left: 10px; top: 69px; width: 54px; height: 12px; vertical-align: middle; font-size: 14px; color: " + precipitationAmountColor  + "; text-align: left; font-weight: 600'>" + weather.precipitationAmount + " in</p>" +
            "<p style='position: absolute; margin: 0px; left: 115px; top: 69px; width: 54px; height: 12px; vertical-align: middle; font-size: 14px; color: " + precipitationChanceColor  + "; text-align: left; font-weight: 600'>" + weather.precipitationChance + "%</p>" +
            "<p style='position: absolute; margin: 0px; left: 10px; top: 111px; width: 54px; height: 12px; vertical-align: middle; font-size: 14px; color: " + iceAccumulationColor  + "; text-align: left; font-weight: 600'>" + weather.iceAccumulation + " in</p>" +
            "<p style='position: absolute; margin: 0px; left: 115px; top: 111px; width: 54px; height: 12px; vertical-align: middle; font-size: 14px; color: " + windSpeedColor  + "; text-align: left; font-weight: 600'>" + weather.windSpeed + " mph</p>" +
            "</div>"
        const infowindow = new window.google.maps.InfoWindow({
            content: content,
        });
        polyline.set('infowindow', infowindow)
        polyline.addListener("mouseover", function(event){
            infowindow.setPosition(event.latLng)
            infowindow.open(map.current)
        })
        polyline.addListener("mouseout", function(event){
            infowindow.close()
        })

        return weather
    }

    const getWeatherDataValues = (values, locationTime, avg) => {
        let bufferCount = 0
        let finalValue = 0
        for(let i = 0; i < values.length; i ++){
            const valuesDate = Date.parse(values[i].validTime.substring(0, values[i].validTime.length - 5))
            if(valuesDate > locationTime.getTime() - 60 * 60 * 1000 * 2 + bufferCount * 60 * 60 * 1000) {
                if(avg){
                    finalValue += values[i - 1].value
                } else if(values[i - 1].value > finalValue) {
                    finalValue = values[i - 1].value
                }
                i--
                bufferCount++
                if (bufferCount > 3) {
                    break
                }
            }
        }
        if(avg){
            return finalValue/4
        }
        return finalValue
    }

    const removeExistingRoutes = () => {
        if(coloredRoutes.current !== null){
            for(let i = 0; i < coloredRoutes.current.length; i ++){
                if(coloredRoutes.current[i] !== null){
                    for(let j = 0; j < coloredRoutes.current[i].length; j ++){
                        coloredRoutes.current[i][j].setMap(null)
                    }
                }
            }
        }
        props.setWeather([])
    }

    return(
        <div
            id="map"
            style={
                {
                    position: 'absolute',
                    right: '0px',
                    width: props.mapWidth,
                    height: 'calc(100vh - 68px)',
                }
            }/>
    )
}

export default Map;