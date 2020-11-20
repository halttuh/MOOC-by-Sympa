let currentChart;

document.getElementById('renderBtn').addEventListener('click', fetchData);

async function fetchData() {
  let countryCode = document.getElementById('country').value;
  const indicatorCode = 'SP.POP.TOTL';
  const baseUrl = 'https://api.worldbank.org/v2/country/';
  const url = baseUrl + countryCode + '/indicator/' + indicatorCode + '?format=json';
  console.log('Fetching data from URL: ' +url);

  let response = await fetch(url);

  if (response.status == 200) {
    let fetchedData = await response.json();
    console.log(fetchedData);

    let data = getValues(fetchedData);
    let labels = getLabels(fetchedData);
    let countryName = getCountryName(fetchedData);
    renderChart(data, labels, countryName);
  }
}

function getValues(data) {
  let vals = data[1].sort((a, b) => a.date - b.date).map(item => item.value);
  return vals;
}

function getLabels(data) {
  let labels = data[1].sort((a, b) => a.date - b.date).map(item => item.date);
  return labels;
}

function getCountryName(data) {
  let countryName = data[1][0].country.value;
  return countryName;
}

function renderChart(data, labels, countryName) {
  let ctx = document.getElementById('myChart').getContext('2d');

  if (currentChart) {
    currentChart.destroy();
  }

  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Population, ' +countryName,
        data: data,
        borderColor: 'rgba(199, 0, 57, 1)',
        backgroundColor: 'rgba(199, 0, 57, 0.2)',
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}
