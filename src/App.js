import { useEffect, useState } from 'react';
import './App.css';
import "./InfoBox.css"
import { Card, CardContent, FormControl, MenuItem, Select } from '@mui/material';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Map from './Map';
import Table from './Table';
import numeral from "numeral"
import { sortData, prettyPrintStat } from './util'
import 'leaflet/dist/leaflet.css'

const App = () => {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases")

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then(data => {
      setCountryInfo(data)
    })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country, index) => ({
          id: index,
          name: country.country,
          value: country.countryInfo.iso2
        }))
        const sortedData = sortData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      })
    }

    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant='outlined' onChange={onCountryChange} value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.id} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
          <InfoBox title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={numeral(countryInfo.cases).format("0.0a")} onClick={(e) => setCasesType("cases")} isRed active={casesType === "cases"}/>
          <InfoBox title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={numeral(countryInfo.recovered).format("0.0a")} onClick={(e) => setCasesType("recovered")} active={casesType === "recovered"} />
          <InfoBox title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={numeral(countryInfo.deaths).format("0.0a")} onClick={(e) => setCasesType("deaths")} isRed active={casesType === "deaths"} />
        </div>

        <div className="app__map">
          <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}/>
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;