var path_1 = "/assets/data/energy_consumption_by_source_korea.csv";
var path_2 = "/assets/data/share_energy_by_source_korea.csv";
var path_3 = "/assets/data/death-rates-from-energy-production-per-twh.csv";
var path_4 = "/assets/data/radar_points.csv";
var path_5 = "/assets/data/co2_emission_by_source.csv";
var path_6 = "/assets/data/capacity-factor.csv";

var config = { responsive: true };

const getEnergyConsumpitonData = (data) => {
  // console.log("data", data);
  let dataSet = [];
  let props = ["Fossil Fuels", "Nuclear", "Solar", "Hydro", "Wind", "Total"];

  let layout = {
    title: 'Energy Consumption in South Korea',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    yaxis: {
      title: {
        standoff: 30,
        text: 'Energy Consumption - TWh',
        font: {
        }
      },
      hoverformat: '.2f'
    },
    xaxis: {
      title: {
        standoff: 30,
        text: 'Year',
        font: {
        }
      }
    },
    showlegend: true,
    font: {
      color: ''
    }
  };
  const sources = {};
  props.forEach((item) => {
    if (!sources[item]) {
      let col = '';
      if (item == "Total") {
        col=""
      } else if (item == "Nuclear") {
        col = "rgba(252, 163, 17, 0.5)";
      } else {
        col = "";
      }
      sources[item] = {
        x: [],
        y: [],
        name: '',
        type: 'scatter',
        hovertemplate: '%{y:.2f} TWh',
        fill: 'tozeroy',
        // stackgroup: 'one',
        // fillcolor: col,
        line: {
          color: col,
        },
      }
    }

    data.forEach((obj) => {
      if (obj[item]) {
        sources[item].y.push(obj[item]);
        sources[item].x.push(obj["Year"]);
        sources[item].name = item;
      }
    })
  })

  for (const [key, value] of Object.entries(sources)) {
    dataSet.push(value);
  }

  Plotly.newPlot('viz_kr', dataSet, layout, config);
}
Plotly.d3.csv(path_1, getEnergyConsumpitonData);

const getShareEnergyData = (data) => {
  let dataSet = [];
  let props = ["Solar", "Nuclear", "Hydro", "Wind", "Other"];
  let layout = {
    title: 'Low-carbon Energy Share in South Korea',
    // width: 800,
    // height: 600,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    yaxis: {
      title: {
        standoff: 30,
        text: 'Share Energy of Total Production (%)',
        font: {
          // color: '#7f7f7f'
        }
      },
      hoverformat: '.2f'
    },
    xaxis: {
      title: {
        standoff: 30,
        text: 'Year',
        font: {
          // color: '#7f7f7f'
        }
      }
    },
    showlegend: true,
    barmode: "stack",
    font: {
      // color: 'whitesmoke'
    }
  };
  const sources = {};
  props.forEach((item) => {
    if (!sources[item]) {
      sources[item] = {
        x: [],
        y: [],
        name: '',
        type: 'scatter',
        mode: 'lines',
        fill: 'tozeroy',
        hovertemplate: '%{y:.2f}%',
      }
    }

    data.forEach((obj) => {
      if (obj[item]) {
        sources[item].y.push(obj[item]);
        sources[item].x.push(obj["Year"]);
        sources[item].name = item;
      }
    })
  })

  // console.log("sources", sources);

  for (const [key, value] of Object.entries(sources)) {
    dataSet.push(value);
  }

  // console.log("dataSet", dataSet);
  Plotly.newPlot('viz_inf', dataSet, layout, config);
}
Plotly.d3.csv(path_2, getShareEnergyData);


const getDeathRateData = (data) => {
  // console.log("data", data);

  let dataSet = [];

  data.forEach((item) => {
    let trace = {
      x: [],
      y: [],
      mode: 'markers',
      name: '',
      text: [],
      marker: {
        size: "10",
      },
      hovertemplate: '%{y:.2f} deaths, %{x:.2f}TWh',
      hoverinfo: "",
    }
    // if (item["Entity"] == "Nuclear") {
    //   trace.marker.color = "rgba(222,45,38,0.8)"
    // } else {
    //   // trace.marker.color = "rgb(72, 99, 103)"
    // }
    trace.name = item["Entity"];
    trace.text.push(item["Entity"]);
    trace.x.push(item["Consumption - TWh"]);
    trace.y.push(item["Deaths per TWh"]);
    // trace.marker.size = 5 + (item["Consumption - TWh"] * 0.075);
    dataSet.push(trace);
  })

  let layout = {
    title: 'Death rate from Energy production per TWh',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    font: {
      // color: 'whitesmoke'
    },
    yaxis: {
      title: {
        standoff: 30,
        text: 'Deaths from Production per TWh',
        font: {
          // color: '#7f7f7f'
        }
      },
      hoverformat: '.2f'
    },
    xaxis: {
      title: {
        standoff: 30,
        text: 'Current Energy Production (TWh)',
        font: {
          // color: '#7f7f7f'
        }
      },
    },
  };

  Plotly.newPlot('viz_sft', dataSet, layout, config);
}
Plotly.d3.csv(path_3, getDeathRateData);

const getCo2BySource = (data) => {
  // console.log("data", data);
  let layout = {
    autosize: true,
    // width: 800,
    // height: 500,
    title: 'Co2 Emission by Energy Source',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      title: {
        text: 'GHG emission (gCO2 equivalent per KWh)',
        hoverformat: '.2f',
        standoff: 30,
      },
      automargin: true,
    },
    yaxis: {
      title: {
        text: 'Energy Source',
        standoff: 30,
        font: {
          // color: '#7f7f7f'
        },
      },
      automargin: true,
    },
    font: {
      // color: 'whitesmoke'
    },
  };

  let trace = {
    x: [],
    y: [],
    type: 'bar',
    name: '',
    marker: {
      color: ['rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(222,45,38,0.8)', 'rgba(72, 99, 103,1)']
    },
    orientation: "h",
    // hovermode: 'closest'
    // hovertemplate: '%{y:.2f} deaths, %{x:.2f}TWh',
    // hoverinfo: "",
  }

  data.forEach((item) => {
    // console.log(item)
    trace.y.push(item.Entity);
    trace.x.push(item["GHG emission (gCO2 equivalent per KWh)"]);
  })

  Plotly.newPlot('viz_env', [trace], layout, config)
}
Plotly.d3.csv(path_5, getCo2BySource);

const getCapacityFactor = (data) => {
  // console.log("data", data);
  let layout = {
    title: 'Capacity Factor of different Energy Sources',
    // width: 600,
    // height: 800,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    yaxis: {
      title: {
        standoff: 30,
        text: 'Capacity Factor (%)',
        font: {
          // color: '#7f7f7f'
        }
      },
      hoverformat: '.2f',
    },
    xaxis: {
      title: {
        standoff: 30,
        text: 'Renewable Energy Source',
        font: {
          // color: '#7f7f7f'
        }
      },
      tickformat: "%{n}f"
    },
    font: {
      // color: 'whitesmoke'
    }
  };

  let trace = {
    x: [],
    y: [],
    type: 'bar',
    name: '',
    marker: {
      color: ['rgba(222,45,38,0.8)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)', 'rgba(72, 99, 103,1)']
    },
    orientation: "v",
    hovertemplate: '%{y:.1f}%',
    text: [],
  }

  data.forEach((item) => {
    // console.log(item)
    trace.x.push(item.Entity.split(" - ")[0]);
    trace.y.push(item["Capacity Factor"]);
  })

  Plotly.newPlot('viz_eff', [trace], layout, config)
}
Plotly.d3.csv(path_6, getCapacityFactor);

// Deaths per TWh,	Capacity Factor (%),	Current Share in Production (%),	GHG Emissions (tonnes CO2e/GWh),	Overnight costs (USD/kWe)
const getRadarChart = (data) => {
  // console.log("data", data);

  let dataSet = [];

  data.forEach((item) => {
    let trace = {
      r: [],
      theta: ['Safeness', 'Reliability', 'Development', 'Cleanliness', 'Cost'],
      type: "scatterpolar",
      name: '',
      fill: 'toself',
      hovertemplate: '%{r}<extra></extra>',
    }
    trace.name = item["Entity"];
    for (const [key, value] of Object.entries(item)) {
      if (key != "Entity") {
        trace.r.push(item[key]);
      }
    }

    dataSet.push(trace);
  })

  // console.log("dataSet", dataSet);

  let layout = {
    title: 'Radar Chart for Low-Carbon Energy Sources',
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    font: {
      // color: 'whitesmoke'
    },
    // legend: {
    //   traceorder: "grouped",
    // },
    polar: {
      bgcolor: "rgba(0,0,0,0)",
      radialaxis: {
        visible: true,
        // color: "#1e87f0",
        range: [0, 5]
      }
    }
  }

  Plotly.newPlot('viz_rad', dataSet, layout, config)
    .then(gd => {
      gd.on('plotly_hover', d => {
        var curveNumber = d.points[0].curveNumber
        var vals = gd.data.map((_, i) => i === curveNumber ? 1 : 0.2)
        Plotly.restyle(gd, 'opacity', vals)
      })
    })
}
Plotly.d3.csv(path_4, getRadarChart);

function normaliseData(array) {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] < min) {
      min = array[i];
    }
  }

  for (let i = 0; i < array.length; i++) {
    var norm = (array[i] - min) / (max - min);
    array[i] = norm * 100;
  }

  return array
}

function normaliseDataInverse(array) {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  for (let i = 0; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] < min) {
      min = array[i];
    }
  }

  for (let i = 0; i < array.length; i++) {
    var norm = (max - array[i]) / (max - min);
    array[i] = norm * 100;
  }

  return array
}