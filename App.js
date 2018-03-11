import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { MapView } from 'expo';
import { Marker } from 'react-native-maps';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      region: {
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      },
      markers: []
    };
  }

  showLocation = () => {

    // lets get location of the address and set it to region -> map will center there
    const url1 = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.address + '&key=AIzaSyCKr507t_1BX2q8aeV_oXA_59kcHW5numQ'
    fetch(url1)
      .then((respon) => respon.json())
      .then((responseData) => {
        const lat = responseData.results[0].geometry.location.lat;
        const lng = responseData.results[0].geometry.location.lng;
        //console.log('lat:' + lat)
        this.setState({
          region: {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221
          }
        })
      });

    // lets get restraurants around address and store resutls
    const url2 = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+' + this.state.address + '&key=AIzaSyCKr507t_1BX2q8aeV_oXA_59kcHW5numQ'

    fetch(url2)
      .then((response) => response.json())
      .then((responseData) => {

        this.setState({
          markers: responseData.results
        })
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }

  onChangeRegion(region) {
    this.setState({ region })
  }
//smoothly move the map by clicking on the map. Just wanted to try!!!
  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.setState(prevState => {
      return {
        region: {
          ...prevState.region,
          latitude: coords.latitude,
          longitude: coords.longitude

        }
      }

    })
  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ height: 450, width: 320 }}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          onPress={this.pickLocationHandler}
        >

          {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={{

                latitude: marker.geometry.location.lat,
                longitude: marker.geometry.location.lng

              }}

              title={marker.name}
              description={marker.formatted_address}
            />
          ))}


        </MapView>
        <TextInput placeholder='Enter address'
          onChangeText={(address) => this.setState({ address })}
          value={this.state.address}
        />
        <Button title="SHOW" onPress={this.showLocation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
