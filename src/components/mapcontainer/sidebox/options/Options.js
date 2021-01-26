import React from "react";
import DateTimePicker from "react-datetime-picker";
import "./Options.css"

function Options(props){

    const handleCheckboxChange = (event) => {
        switch(event.target.name){
            case 'avoidHighways':
                props.setAvoidHighways(event.target.checked)
                break
            case 'avoidTolls':
                props.setAvoidTolls(event.target.checked)
                break
            case 'avoidFerries':
                props.setAvoidFerries(event.target.checked)
                break
            default:
                console.log(event)
        }
    }

    return (
        <div className="Options-Container">
            <p className="Depart">Depart At</p>
            <DateTimePicker className="Date-Picker"
                            onChange={props.setDate}
                            value={props.date}
                            format="M/d/y h:mm a"
                            minDate={new Date()}
            />
            <input
                name="avoidHighways"
                type="checkbox"
                className="Checkbox"
                style={{top: "15px"}}
                checked={props.avoidHighways}
                onChange={handleCheckboxChange}/>
            <input
                name="avoidTolls"
                type="checkbox"
                className="Checkbox"
                style={{top: "39px"}}
                checked={props.avoidTolls}
                onChange={handleCheckboxChange}/>
            <input
                name="avoidFerries"
                type="checkbox"
                className="Checkbox"
                style={{top: "63px"}}
                checked={props.avoidFerries}
                onChange={handleCheckboxChange}/>
            <p className="Avoid" style={{top: "13px"}}>Avoid Highways</p>
            <p className="Avoid" style={{top: "37px"}}>Avoid Tolls</p>
            <p className="Avoid" style={{top: "61px"}}>Avoid Ferries</p>
        </div>
    )

}

export default Options;