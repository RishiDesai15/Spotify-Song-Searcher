import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //A css file used in the react bootstrap libraries 
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState,  useEffect } from 'react';

const ClientID = "5a908f5699274beb9a7359492e533908";
const SecretID =  "3c5014406577479dad415f4d8771e3b1";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() =>{
    // API Access Token - Required to make a specific request to spotify API to get token for a certain client to use 
    var authParameters = {
      method: 'POST',
      headers:  {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + ClientID + '&client_secret=' + SecretID 
    }
    fetch('https://accounts.spotify.com/api/token',authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  },[])

// Search Function
async function search() {
  console.log("Search for" + searchInput);

  // Get a request using  search to get Artist  ID
  var searchParam = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParam)
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id })
  console.log("Artist ID is " + artistID);
  // Get request with Artist ID and grab all the albums from that specific artist
  var albumsParam = await fetch("https://api.spotify.com/v1/artists/" + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParam)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    });

}
console.log(albums);
  return (
    <div className="App">
     <Container>
      <InputGroup className="mb-3" size="lg">
        <FormControl
          placeholder="Search For Artist"
          type="input"
          onKeyDown={event => {
          if(event.key == "Enter") {
            search();
            }
          }}
          onChange={event  => setSearchInput(event.target.value)}
        />
        <Button onClick={search}>
          Search
        </Button>
      </InputGroup>
     </Container>
     <Container>
      <Row  className="mx-2 row row-cols-4">
        {albums.map((album, i) => {
          console.log(album);
          return (
            <Card>
              <Card.Img src={album.images[0].url}></Card.Img>
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
