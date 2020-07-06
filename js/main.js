function getRandomColor() {
  // https://stackoverflow.com/a/1484514/10199319
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function updateStats() {
  const datePic = document.getElementById("date").value;
  const chartDiv = document.querySelector("#chart");
  chartDiv.innerHTML = "";
  const city = document.getElementById("city").value;
  const today = moment().subtract(datePic, "days").format("YYYY.MM.DD");

  const m = document.getElementById("stat").value;

  let metric;
  let lbl;
  let unit;

  switch (m) {
    case "temp":
      metric = 3;
      lbl = "Temperature";
      unit = "°C";
      break;
    case "humidity":
      metric = 2;
      lbl = "Humidity";
      unit = "%";
      break;
    case "wind":
      metric = 1;
      lbl = "Wind Speed";
      unit = "m/s";
      break;
    case "rain":
      metric = 5;
      lbl = "Precipitation";
      unit = "%";
      break;
    case "pressure":
      metric = 4;
      lbl = "Pressure";
      unit = "hPa";
      break;
    case "clouds":
      metric = 7;
      unit = "Cloud coverage";
      unit = "%";
      break;
  }

  const url = `https://raw.githubusercontent.com/filiptronicek/czech-weather/master/data/${city}/${today}.csv`;

  $.get(url, function (data) {
    const lddPoints = getDataPointsFromCSV(data, metric);
    let xs = [];
    let ys = [];
    for (let i of lddPoints) {
      xs.push(i.x);
      ys.push(i.y);
    }
    console.log("Formatted outputs: ");
    const filteredy = ys.filter(function (value, index, ar) {
      return index % 2 == 0;
    });
    const filteredx = xs.filter(function (value, index, ar) {
      return index % 2 == 0;
    });

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
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Number.parseFloat(val).toFixed(2) + unit;
          },
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
setInterval(() => {
  updateStats();
}, 600000);
