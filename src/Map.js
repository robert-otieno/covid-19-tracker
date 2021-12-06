import './Map.css'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { showDataOnMap } from './util'

const Map = ({countries, casesType, center, zoom}) => {
    function ChangeMap({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
    }

    return (
        <div className='map'>
            <MapContainer scrollWheelZoom={false} >
            <ChangeMap center={center} zoom={zoom} />
                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {showDataOnMap(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map