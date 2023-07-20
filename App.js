import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container,InputGroup, FormControl,Button,Row, Card, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';

const CLIENT_ID = "2790e7ae02f54607a40349a0f2d2df01";
const CLIENT_SECRET = "1dcabdd9be304a0b8a1cfa3c4b4643bb";




function App() {

const [searchInput, setSearchInput] = useState("");
const [accessToken, setAccessToken] = useState("");
const [albums, setAlbums] = useState([]);
useEffect(() => {
  //API access token
  var authParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body :'grant_type=client_credentials&client_id='+ CLIENT_ID + "&client_secret=" + CLIENT_SECRET
     
  }
  fetch('https://accounts.spotify.com/api/token',authParameters)
    .then(result => result.json())
    .then(data => setAccessToken(data.access_token))
},[])

//Search Function
async function search(){
  console.log("Search for " + searchInput)

  // get request using search to get Artist ID
  var searchParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
    
  }

  var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',searchParameters)
  .then(response => response.json())
  .then(data => {return data.artists.items[0].id })

  console.log('Artist ID: ' + artistID)
  //Get request with Artist ID to grab all the albums from that artist
  var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50',searchParameters)
  .then(response => response.json())
  .then(data =>{
    setAlbums(data.items)
    
  })
  // //Display those albums to the user
  console.log(albums);
}
  return (
    <div className="App">
      <Container>
        <InputGroup className = "mb-3"size = "lg">
          <FormControl
            placeholder = "Search for Artist"
            type = "input"
            onKeyPress={event=> {
              if(event.key == "Enter"){
                console.log('Pressed Enter')
                search();
              }
            }}
            onChange = {event => setSearchInput(event.target.value)}
            
            >
            </FormControl>
            <Button onClick={search}>
              Search
            </Button>
        </InputGroup>
      </Container>
      <Alert>
        Album list for: {albums[0].artists[0].name}
      </Alert>
      <Container>
        <Row className="mx-2 row row-cols-4">
          {albums.map((album, i)=>{
            console.log(album)
            return (
              <Card>
              <Card.Img src = {album.images[0].url}/>
              <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
              </Card.Body>
              </Card>
            )
          })}
        </Row>
        
      </Container>
    </div>
  );
}

export default App;
