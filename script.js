import "./scripts/globe.js";
import "./scripts/plot.js";
import "./scripts/aos.js";

import { initGlobe } from "./scripts/globe.js";

$(document).ready(function () {
  var slideIndexS = 0,
    sliding = false;

  var counter = 0;

  var myFullPage = new fullpage("#container", {
    normalScrollElements: '.scrollable',
    sectionSelector: ".page",
    // scrollOverflow: true,
    // autoScrolling: true,
    navigation: false,
    // css3: true,
    controlArrows: false,
    menu: "#scrollSpy",
    anchors: ["intro", "globeVis", "netZero", "carbonNeutrality", "quote", "nuclearEnergy_intro", "nuclearEnergy", "eval", "conc"],
    licenseKey: 'gplv3-license',
    slidesNavigation: true,

    // scrollBar: true,

    onLeave: function (origin, destination, direction) {
      // console.log('Index: ' + origin.index + ' Slide Index: ' + slideIndexS);

      if (origin.index === 6 && !sliding) {
        if (direction === 'down' && slideIndexS < 4) {
          fullpage_api.moveSlideRight();
          return false;
        } else if (direction === "down" && slideIndexS == 4) {

        } else if (direction === 'up' && slideIndexS > 1) {
          fullpage_api.moveSlideLeft();
          return false;
        }
      } else if (sliding) {
        return false;
      }
      $('.page [data-aos]').removeClass("aos-animate");
      $('.page .animate').removeClass("animate__animated");
      UIkit.notification.closeAll();
    },

    onScrollOverflow: function (section, slide, position, direction) {
      var params = {
        section: section,
        slide: slide,
        position: position,
        direction: direction
      };

      console.log("--- onScrollOverflow ---");
      console.log(params);
    },

    onSlideLeave: function () {
      $(".slide [data-aos]").removeClass("aos-animate");
      $('.slide .animate').removeClass("animate__animated");
    },

    afterSlideLoad: function (section, origin, destination, direction) {
      slideIndexS = destination.index + 1;
      if (destination.index !== 5) {
        $('.slide.active [data-aos]').addClass("aos-animate");
        $('.slide.active .animate').addClass("animate__animated");
      }
    },

    afterLoad: function (origin, destination, direction, trigger) {
      if (destination.index !== 5) {
        $('.page.active [data-aos]').addClass("aos-animate");
        // $('.page.active .animate').addClass("animate__animated");
      }

      if (destination.index == 1) {
        if (counter == 0) {
          initGlobe();
          counter++;
        }
      }
    },

    beforeLeave: function (origin, destination, direction, trigger) {

      // if (origin.index == 1 && direction == 'down') {
      //   console.log(getCurrentYear());
      //   if (getCurrentYear() < 2020) {
      //     globeData.currentYear ++;
      //     console.log(globeData.currentYear);
      //     updateCurrentYear(globeData.currentYear);
      //     return getCurrentYear == 2020;
      //   } else {
      //     console.log("scroll enabled");
      //     return true;
      //   }
      // }
    }
  })
})