import END_POINT from '../config/';

class CovidData {
  // get summary by covid endpoint
  static getSummary() {
    return fetch(END_POINT.ENDPOINT_SUMMARY)
      .then(r => r.json())
      .then(json => {
        // Map disease.sh global response to existing component shape
        // disease.sh /all returns: { cases, recovered, deaths, ... }
        const mapped = {
          confirmed: { value: json && json.cases },
          recovered: { value: json && json.recovered },
          deaths: { value: json && json.deaths },
        };
        return Promise.resolve(mapped);
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
  // get all countries by covid endpoint
  static getAllCountries() {
    return fetch(END_POINT.ENDPOINT_COUNTRIES)
      .then(r => r.json())
      .then(json => {
        // disease.sh /countries returns array of { country, countryInfo: { iso2, iso3 }, cases, ... }
        const list = Array.isArray(json) ? json : [];
        const countries = list
          .filter(function(item) { return item && item.countryInfo && item.countryInfo.iso3; })
          .map(function(item) { return { name: item.country, iso3: item.countryInfo.iso3 }; });
        return Promise.resolve({ countries });
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }

  // get all confirmed cases by covid endpoint
  static getSingleCountry(countryIso3) {
    // disease.sh supports /countries/{query}?strict=true where query can be ISO3
    const url = `${END_POINT.ENDPOINT_COUNTRIES}/${countryIso3}?strict=true`;
    return fetch(url)
      .then(r => r.json())
      .then(json => {
        const mapped = {
          confirmed: { value: json && json.cases },
          recovered: { value: json && json.recovered },
          deaths: { value: json && json.deaths },
        };
        return Promise.resolve(mapped);
      })
      .catch(e => {
        return Promise.reject(e);
      });
  }
}

export default CovidData;