function getRandomColor() {
  // https://stackoverflow.com/a/1484514/10199319
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function updateStats(today = moment(new Date(document.querySelector("#date").value).getTime()).format("YYYY.MM.DD") || moment().format("YYYY.MM.DD")) {
  const chartDiv = document.querySelector("#chart");
  chartDiv.innerHTML = "";
  const city = document.getElementById("city").value;

  const m = document.getElementById("stat").value;

  let metric;
  let lbl;
  let unit;

  switch (m) {
    case "wind":
      metric = 1;
      lbl = "Wind Speed";
      unit = "m/s";
      break;
    case "humidity":
      metric = 2;
      lbl = "Humidity";
      unit = "%";
      break;
    case "temp":
      metric = 3;
      lbl = "Temperature";
      unit = "°C";
      break;
    case "pressure":
      metric = 4;
      lbl = "Pressure";
      unit = "hPa";
      break;
    case "rain":
      metric = 5;
      lbl = "Precipitation";
      unit = "%";
      break;
    case "clouds":
      metric = 7;
      unit = "Cloud coverage";
      unit = "%";
      break;
  }

  const url = `https://raw.githubusercontent.com/filiptronicek/czech-weather/master/data/${city}/${today}.csv`;

  $.get(url, (data) => {
      const lddPoints = getDataPointsFromCSV(data, metric);
      let xs = [];
      let ys = [];
      for (let i of lddPoints) {
        xs.push(i.x);
        ys.push(i.y);
      }
      console.log("Formatted outputs: ");
      const filteredy = ys.filter((_value, index, _ar) => index % 2 == 0);
      const filteredx = xs.filter((_value, index, _ar) => index % 2 == 0);

      const options = {
        series: [
          {
            name: lbl,
            data: ys,
          },
        ],
        responsive: [
          {
            breakpoint: 1000,
            options: {
              dataLabels: {
                enabled: false,
              },
              series: [
                {
                  data: filteredy,
                  labels: lbl,
                },
              ],
              xaxis: {
                categories: filteredx,
                title: {
                  text: "Time",
                },
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
        chart: {
          height: 350,
          type: "line",
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
        },
        colors: [getRandomColor()],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: "smooth",
        },
        title: {
          align: "center",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        yaxis: {
          labels: {
            formatter: (val) => Number.parseFloat(val).toFixed(2) + unit,
          },
        },
        xaxis: {
          categories: xs,
          title: {
            text: "Time",
          },
        },
      };

      const chart = new ApexCharts(chartDiv, options);
      chart.render();
    });
}

function getDataPointsFromCSV(csv, metric) {
  const dataPoints = (csvLines = points = []);
  csvLines = csv.split(/[\r?\n|\r|\n]+/);

  const tz = moment.tz("Europe/Prague");
  const offset = (tz.utcOffset() - (tz.utcOffset() % 60)) / 60;

  for (let i = 0; i < csvLines.length; i++)
    if (csvLines[i].length > 0) {
      points = csvLines[i].split(",");
    if (
        i % 2 === 0 &&
        parseFloat(points[0]) + offset < 25
      ) {
        dataPoints.push({
          x: parseFloat(points[0]) + offset + ":00",
          y: parseFloat(points[metric]),
        });
      }
    }
  return dataPoints;
}

updateStats();
const picker = datepicker(".datepicker", {
  maxDate: new Date(),
  minDate: new Date(2020, 4, 26),
  showAllDates: true,
  disableMobile: true,
  onSelect: (_instance, date) => {
    updateStats(moment(date.getTime()).format("YYYY.MM.DD"));
  }
});

setInterval(() => {
  updateStats();
}, 600000);
