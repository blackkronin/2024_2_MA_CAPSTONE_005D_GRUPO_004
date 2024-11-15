// For this example you need the node-fetch npm packages: `npm i node-fetch`
import fetch from 'node-fetch';

fetch('https://api.scraperapi.com/structured/google/news?api_key=6ae5c16e9463a3631636ca2bdd090ca6&query=Tesla&country_code=cl&num=10')
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.log(error)
  });
