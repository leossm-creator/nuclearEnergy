const GLOBE_IMAGE_URL = "//cdn.jsdelivr.net/npm/three-globe/example/img/earth-dark.jpg";
const GREENHOUSE_API = "assets/data/world_carbon_emission.json";
const GEOJSON_URL = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";
const colourScale = d3.scaleSequential(d3.interpolateLab("green", "red"))
const altitude = 0.0063;
var world;
var currentYear = 1950;

var globeData = {
  currentYear: 1950,
}

const initGlobe = async () => {
  const globeContainer = document.getElementById("globeGl");
  world = Globe()(globeContainer)
    .globeImageUrl(GLOBE_IMAGE_URL)
    .showGraticules(false)
    .polygonAltitude(nation => extrudeCountries(nation))
    .backgroundColor("whitesmoke")
    .showAtmosphere(true)
    .atmosphereColor("#14213d")
    .atmosphereAltitude("0.25")
    .polygonCapColor(nation => colourCountries(nation))
    .polygonSideColor(nation => colourSides(nation))
    .polygonStrokeColor(() => "rgba(255, 255, 255, 0.4)")
    .polygonLabel(nation => {
      // console.log("nation", nation)
      const countryInfo = nation.properties;
      const countryData = nation.data;
      return getPolygonLabel(countryInfo, countryData);
    })
    .onPolygonHover((hoverD) =>
      world
        .polygonAltitude((d) => (d === hoverD ? extrudeCountries(d) + 0.05 : extrudeCountries(d)))
        .polygonCapColor((d) =>
          d === hoverD ? "rgba(255, 255, 255, 0.85) 100.1%" : colourCountries(d)
        )
    )
    .polygonsTransitionDuration(300);

  // Auto-rotate
  world.controls().autoRotate = false;
  world.controls().autoRotateSpeed = 0.6;
  world.controls().enableZoom = false;
  world.width(window.innerWidth);
  world.height(window.innerHeight);

  // Default
  world.pointOfView({
    lat: null,
    lng: 120,
    altitude: 3
  }, 0);

  await getData();

  console.log("data received")

  await window.addEventListener("resize", () => {
    world.width(window.innerWidth);
    world.height(window.innerHeight);
  });

  animateCount = 0;
  animateTimescale();
}

const extrudeCountries = (nation) => {
  if (nation.hasOwnProperty("data")) {
    return altitude + nation.data.co2 / 22500;
  }
}

const colourCountries = (nation) => {
  if (nation.hasOwnProperty("data")) {
    if (nation.data.co2 <= 0) {
      return "rgba(255, 255, 255, 0.1)";
    } else {
      return colourScale(getVal(nation));
    }
  }
}

const colourSides = (nation) => {
  if (nation.hasOwnProperty("data")) {
    if (nation.data.co2 <= 0) {
      return "rgba(255, 255, 255, 0.1)";
    } else {
      let colour = colourScale(getVal(nation));
      colour = colour.replace(')', ', 0.85)').replace('rgb', 'rgba');

      return colour
    }
  }
}

const getVal = (nation) => {
  return Math.pow(nation.data.co2, 0.2);
};

function getPolygonLabel(countryInfo, countryData) {
  // console.log(countryInfo, countryData)
  let col;
  let cont = countryInfo.CONTINENT;

  console.log(countryInfo.CONTINENT);

  if (cont == "Asia") {
    col = "yellow";
  } else if (cont == "Europe") {
    col = "blue";
  } else if (cont == "North America") {
    col = "green";
  } else if (cont == "South America") {
    col = "purple";
  } else if (cont == "Africa") {
    col = "orange";
  } else if (cont == "Oceania") {
    col = "red";
  } else if (cont == "Antarctica") {
    col = "white"
  }

  return `
            <div class="uk-card uk-card-small uk-card-body" id="globeTooltip">
              <div class="country_info">
                <h3 class="uk-card-title country_name">${countryInfo.NAME}</h3><span class="uk-label continent ${col}">${countryInfo.CONTINENT}</span>
                <div class="country_info_container">
                  <span class="uk-text-meta country_income">${countryInfo.INCOME_GRP.slice(3)}</span>
                </div>
              </div>
              <ul class="uk-list">
                <li><span class="tooltip_class">Co2 Emission:</span><span class="tooltip_data">${numberWithCommas(Number(countryData["co2"]).toFixed(2))}<span class="tooltip_unit">million t</span></span></li>
                <li><span class="tooltip_class">Co2 Emission per capita:</span><span class="tooltip_data">${numberWithCommas(Number(countryData["co2_per_capita"]).toFixed(2))}<span class="tooltip_unit">t</span></span></li>
                <li><span class="tooltip_class">Share in Global Co2:</span><span class="tooltip_data">${numberWithCommas(Number(countryData["share_global_co2"]).toFixed(2))}<span class="tooltip_unit">%</span></span></li>
                <li><span class="tooltip_class">Primary Energy Consumption:</span><span class="tooltip_data">${numberWithCommas(Number(countryData["primary_energy_consumption"]).toFixed(2))}<span class="tooltip_unit">TWh</span></span></li>
              </ul>
            </div>
          `;
}

var world_co2_json;
let countries;
let featureCollection;

async function getData() {
  world_co2_json = await request("assets/data/world_carbon_emission.json");
  // console.log("world_co2_json", world_co2_json);

  featureCollection = (await request(GEOJSON_URL)).features;
  // console.log("featureCollection: ", featureCollection);

  await updatePolygonsData(world_co2_json[globeData.currentYear], featureCollection);
  await updateWorldData(globeData.currentYear);
}

function updatePolygonsData(array, collection) {
  for (let i = 0; i < array.length; i++) {
    let current = array[i];
    for (let j = 0; j < collection.length; j++) {
      if (current.iso_code == collection[j].properties["ADM0_ISO"]) {
        collection[j].data = {
          co2: current.co2,
          co2_per_capita: current.co2_per_capita,
          share_global_co2: current.share_global_co2,
          primary_energy_consumption: current.primary_energy_consumption,
        };
      }
    }
  }

  // const maxVal = Math.pow(600, 1 / 4);
  const maxVal = Math.pow(600, 0.3);
  colourScale.domain([0, maxVal]);
  world.polygonsData(featureCollection);
}

function updateWorldData(year) {
  let array = world_co2_json[year];
  for (let i = 0; i < array.length; i++) {
    let current = array[i];
    if (current.iso_code == "OWID_WRL") {
      let co2;
      let co2_pc;
      let pec;

      if (current.co2 != null) {
        co2 = numberWithCommas((current.co2 / 1000).toFixed(2));
        $("#w_c02_unit").removeClass("uk-hidden");
      } else {
        co2 = "No Data";
        $("#w_c02_unit").addClass("uk-hidden");
      }

      if (current.co2_per_capita != null) {
        co2_pc = numberWithCommas(current.co2_per_capita.toFixed(2));
        $("#w_c02_pc_unit").removeClass("uk-hidden");
      } else {
        co2_pc = "No Data";
        $("#w_c02_pc_unit").addClass("uk-hidden");
      }

      if (current.primary_energy_consumption != null) {
        pec = numberWithCommas(current.primary_energy_consumption.toFixed(2));
        $("#w_pec_unit").removeClass("uk-hidden");
      } else {
        pec = "No Data";
        $("#w_pec_unit").addClass("uk-hidden");
      }

      $("#w_co2").html(co2);
      $("#w_co2_pc").html(co2_pc);
      $("#w_pec").html(pec);
    }
  }
}

const updateCurrentYear = async (newYear) => {
  await updatePolygonsData(world_co2_json[newYear], featureCollection);
  await updateWorldData(newYear);
  yearElem.innerHTML = newYear;
}

function getCurrentYear() {
  return globeData.currentYear;
}

async function updatePointOfView() {
  try {
    const { latitude, longitude } = await getCoordinates();
    world.pointOfView({
      lat: latitude,
      lng: longitude,
      altitude: 2.15
    },
      3000
    );
  } catch (e) {
    console.log("Unable to set point of view.");
  }
}

async function request(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    throw e;
  }
}

async function getCoordinates() {
  try {
    const { latitude, longitude } = await request(
      "https://geolocation-db.com/json/"
    );
    return {
      latitude,
      longitude,
    };
  } catch (e) {
    throw e;
  }
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const yearElem = document.getElementById("currentYear");

var rangeSlider = document.getElementById('verticalSlider');

noUiSlider.create(rangeSlider, {
  range: {
    'min': 1950,
    'max': 2020
  },
  step: 1,
  start: [1950],
  orientation: 'vertical',
  direction: 'rtl',
  animate: true,
  // tooltips: {
  //   // 'to' the formatted value. Receives a number.
  //   to: function (value) {
  //     return value + '';
  //   },
  //   // 'from' the formatted value.
  //   // Receives a string, should return a number.
  //   from: function (value) {
  //     return Number(value.replace(',-', ''));
  //   }
  // },
  behaviour:'drag-hover',
  pips: {
    mode: 'range',
    stepped: false,
    density: 10
  }
});

rangeSlider.noUiSlider.on('slide', function (values, handle, unencoded, tap, positions, noUiSlider) {
  let val = parseInt(values[0]);
  globeData.currentYear = parseInt(val);
  // console.log("currentYear", currentYear);
  updateCurrentYear(globeData.currentYear);
})

// rangeSlider.noUiSlider.on('hover', function (values, handle, unencoded, tap, positions, noUiSlider) {

// })

var modal = UIkit.modal($("#modal"), {});

var animateCount = 0;
function animateTimescale() {
  setTimeout(function () {
    if (animateCount < 70) {
      animateCount++
      globeData.currentYear = 1950 + animateCount;
      rangeSlider.noUiSlider.set(globeData.currentYear);
      updateCurrentYear(globeData.currentYear)
      animateTimescale();
    } else {
      setTimeout(function () {
        // UIkit.modal($("#modal"), {}).show();
        UIkit.notification({ message: '<span uk-icon="icon: world" class="icons"></span>Drag and hover to view details of each nations', pos: "bottom-center", timeout: 0 })
      }, 400);
    }
  }, 50);
}


export { initGlobe };

