import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { connect } from "react-redux";
import Filters from "../../components/Filters/Filters";
import Loader from "../../components/UI/Loader/Loader";
import Listing from "../../components/UI/Listing/Listing";
import Map from "../../components/Map/Map";
import ToggleMap from "../../components/Map/ToggleMap";
import { queryToLocation, returnFilters } from "../../utils";
import "./Search.css";

class Search extends Component {
  state = {
    filteredHomes: null,
    filters: {
      guests: {
        adults: 1,
        children: 0,
        infants: 0
      },
      homeType: {
        entirePlace: null,
        privateRoom: null,
        sharedRoom: null
      },
      price: {
        min: 9,
        max: 500
      }
    },
    location: null,
    showMap: false,
    mapCenter: null,
    hover: null
  };

  guestController = (operation, guestType) => {
    const newFilters = { ...this.state.filters };
    if (operation === "inc") {
      newFilters.guests[guestType]++;
    } else if (operation === "dec") {
      if (newFilters.guests[guestType] > 0) {
        if (guestType === "adults" && newFilters.adults > 1) {
          newFilters.guests[guestType]--;
        }
        newFilters.guests[guestType]--;
      }
    }
    this.setState({ filters: newFilters });
  };

  homeTypeToggler = type => {
    const newFilters = { ...this.state.filters };
    newFilters.homeType[type] = !newFilters.homeType[type];
    this.setState({ filters: newFilters });
  };

  rangeController = values => {
    const newFilters = { ...this.state.filters };
    const [min, max] = [values.min, values.max];
    newFilters.price.min = min;
    newFilters.price.max = max;
    this.setState({ filters: newFilters });
  };

  filterHomes = () => {
    const data = Object.values(this.props.homes);
    const filters = this.state.filters;
    const location = queryToLocation(this.props.location.search);
    let filteredHomes = data.filter(
      home =>
        home.location.city.toLowerCase().includes(location.toLowerCase()) ||
        home.location.state.toLowerCase().includes(location.toLowerCase())
    ); // filter for location

    filteredHomes = filteredHomes.filter(
      home =>
        home.information.guestLimit >=
        Object.values(filters.guests).reduce((a, b) => a + b)
    ); // filter for guests

    filteredHomes = filteredHomes.filter(
      home =>
        home.information.price.weekday <= filters.price.max &&
        home.information.price.weekday >= filters.price.min
    ); //filter for price
    this.setState({ filteredHomes });
  };

  resetFilters = type => {
    const newFilters = { ...this.state.filters };
    newFilters[type] = returnFilters(type);
    this.setState({ filters: newFilters }, this.filterHomes);
  };

  componentDidMount() {
    this.filterHomes();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      queryToLocation(prevProps.location.search) !==
      queryToLocation(this.props.location.search)
    ) {
      this.filterHomes();
      const { showMap } = this.state;

      if (showMap) {
        this.getMapCenter();
      }
    }
  }

  renderListings = homes => {
    let listings = <Loader />;
    if (homes !== null) {
      if (homes.length === 0) {
        listings = <h1>No results</h1>;
      } else {
        listings = Object.values(homes).map((listing, idx) => {
          return (
            <Listing
              mouseIn={() => this.setState(() => ({ hover: idx }))}
              mouseOut={() => this.setState(() => ({ hover: null }))}
              listingData={listing}
              key={`listing-${idx}`}
            />
          );
        });
      }
    }
    return listings;
  };

  toggleMap = async () => {
    await this.setState(() => ({ showMap: !this.state.showMap }));
    const { showMap } = this.state;
    showMap ? this.getMapCenter() : this.clearMap();
  };

  clearMap = () => {
    this.setState({
      location: null,
      mapCenter: null
    });
  };

  getMapCenter = () => {
    const location = queryToLocation(this.props.location.search);
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${process.env.REACT_APP_MAPBOXKEY}`
      )
      .then(res => {
        const mapCenter = {
          lng: res.data.features[0].center[0],
          lat: res.data.features[0].center[1]
        };
        this.setState({ mapCenter });
      }); //get new map center
  };

  render() {
    const { filteredHomes, showMap, mapCenter } = this.state;
    const mapBtnPortal = document.getElementsByClassName("Filters")[0];
    return (
      <Fragment>
        <Filters
          guestController={this.guestController}
          homeTypeToggler={this.homeTypeToggler}
          rangeController={this.rangeController}
          apply={this.filterHomes}
          reset={this.resetFilters}
          filters={this.state.filters}
          showMap={this.state.showMap}
          toggleMap={this.toggleMap}
        />
        <div className="Listings">
          <div className="Listings-Results">
            {this.renderListings(filteredHomes)}
          </div>
          {mapBtnPortal &&
            ReactDOM.createPortal(
              <ToggleMap
                toggleMap={this.toggleMap}
                showMap={this.state.showMap}
              />,
              mapBtnPortal
            )}

          {showMap && mapCenter && (
            <Map
              newCenter={mapCenter}
              hover={this.state.hover}
              filteredHomes={this.state.filteredHomes}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  homes: state.homes.homes
});

export default connect(mapStateToProps)(Search);
