import './Tracker.css';
import iconArrow from './icon-arrow.svg'
import iconLocation from './icon-location.svg'
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    ZoomControl,
    useMap,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import axios from 'axios';

//const apiKey = 'at_go3aPzXxeMvf4TJm5qBksUbOAndSH'

export const Tracker = () => {
    const [input, setInput] = useState("");
    const [data, setData] = useState( false
        // ip: ('154.113.73.66'),
        // city: ('Seixal'),
        // country_name: ('Portugal'),
        // region: ('District of Set\u00fabal'),
        // timezone_name: ('Europe\/Lisbon'),
        // isp: ('Mainone Cable Company')
    );
    const [mapConfig, setMapConfig] = useState({
        center: [-6.121435, 106.774124],
        zoom: 13,
    });
  // return res.json()
   

  const getData = async () => {
     const data = await axios
         .get(`https://json.geoiplookup.io/${input}`) //https:geo.ipify.org/api/v1/country?apiKey=${apiKey}&ipAddress=$
         .then((res) => res.data)
         .catch((err) => console.log(err));
     setData(data);
     setInput('');
 };



useEffect(() => {
    getData()
}, [])



// checking whether the input value is ip address or domain name
const validate = () => {
    if (
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            input
        )
    )
        getData('ipAddress');
    else if (/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(input))
        getData('domain');
    else setInput('');
};

 const submitHandler = async () => {
     if (input.trim() === '') {
         setData({});
         return setInput('');
     }
     validate();
 };


    

    

    const ChangeView = ({ center, zoom }) => {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    };

    const customMarker = L.icon({
        iconUrl: iconLocation,
        // iconRetinaUrl: iconLocation,
        iconAnchor: [5, 55],
        popupAnchor: [12, -44],
        iconSize: [35],
    });






    return (
        <div className="body">
            <div className="header">
                <div className="container hero">
                    <h1>IP Address Tracker</h1>
                    <form className="form" onSubmit={(e) => getData(e)}>
                        <input
                            className="input"
                            placeholder="Search for any IP address or domain"
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="button">
                            <img className="btn-icon" src={iconArrow} alt="arrow" onSubmit={submitHandler} ></img>
                        </button>
                    </form>

                    <div className="container information-wrapper">
                        <div className="information">
                            <div className="info-item">
                                <label className="info-title">IP Address</label>
                                <p className="info-text">{data.ip}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-title">Location</label>
                                <p className="info-text">{data.country_name && data.city && data.region}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-title">TimeZone</label>
                                <p className="info-text">{data.timezone_name}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-title">ISP</label>
                                <p className="info-text">{data.isp}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="main">
                <MapContainer
                    center={mapConfig.center}
                    zoom={mapConfig.zoom}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ZoomControl position="bottomright" />
                    <ChangeView center={mapConfig.center} zoom={mapConfig.zoom} />
                    {data.ip !== "" && (
                        <Marker position={mapConfig.center} icon={customMarker}>
                            <Popup>{data.ip}</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

   