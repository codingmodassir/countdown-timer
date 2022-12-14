

const coundownPicker = document.querySelectorAll(".coundown_picker"),
      coundownStatus = document.querySelectorAll("h1 span");


coundownPicker.forEach( function( elem, index ) {
   var i = 0, scrollData = 0,
      skip = elem.offsetHeight, // height of coundown picker
      len = +elem.dataset["limit"] + 1,
      dataVal = +coundownStatus[ index ].dataset["value"];

   for ( ; i < len; i++ ) {
      // insert coundown data
      elem.innerHTML += `<div>${ i < 10 ? `0${i}` : i }</div>`;
   }

   elem.addEventListener("wheel", function( e ) {
      e.preventDefault();

      if ( e.wheelDelta < 0 ) {
         scrollData += skip;
         dataVal++;
      } else {
         scrollData -= skip;
         dataVal--;
      }

      if ( scrollData < 0 ) {
         scrollData = 0;
         dataVal = 0;
      } else if ( scrollData > ( elem.scrollHeight - skip ) ) {
         scrollData = elem.scrollHeight - skip;
         dataVal = elem.children.length - 1;
      }

      dataVal = dataVal < 10 ? "0" + dataVal : dataVal;
      elem.scrollTop = scrollData;
      coundownStatus[ index ].dataset["value"] = dataVal;
      coundownStatus[ index ].dataset["match"] = dataVal;

      classControl(".controls", "active", "remove");
      // coundown picker validation
      coundownStatus.forEach( function( elem ) {
         if ( +elem.dataset["value"] ) {
            classControl(".controls", "active", "add");
         }
      });
   });
});

// classList handling fn
function classControl( elem, className, method ) {
   elem = typeof elem === "string" ? 
      document.querySelectorAll( elem ) : 
      elem.nodeType ? [ elem ] : elem;

   elem.forEach( function( elem ) {
      elem.classList[ method ]( className );
   });
}


const startButton = document.querySelector(".start"),
      stopButton = document.querySelector(".stop"),
      resetButton = document.querySelector(".reset");

var startInterval;


var hElem = coundownStatus[ 0 ], mElem = coundownStatus[ 1 ],
      sElem = coundownStatus[ 2 ];

function startCoundown( h, m, s, match ) {
   startInterval = setInterval( function() {

      if ( h || m || s ) {
         s--;
         if ( s < 0 ) {
            m--;
            s = 59;
            if ( m < 0 ) {
               h--;
               m = 59;
            }
         }

         h = +h, m = +m, s = +s;

         if ( !h && !m && match.second <= 30 && match.second > 10 ) {
            if ( s <= 3 ) {
               classControl("h1", "danger", "add");
               classControl("h1", "stop", "add");
            }
         }
         if ( !h && !m && match.second <= 60 && match.second > 30 ) {
            if ( s <= 10 ) {
               classControl("h1", "stop", "add");
               classControl("h1", "danger", "add");
            }
         }

         if ( !h && !m && !s ) {
            resetCoundown();
            clearInterval( startInterval );
         }

         // format coundown
         h = h < 10 && typeof h !== "string" ? "0" + h : h;
         m = m < 10 && typeof m !== "string" ? "0" + m : m;
         s = s < 10 && typeof s !== "string" ? "0" + s : s;

         setCoundown( h, m, s );
      }

   }, 1000);
}


function resetCoundown() {
   classControl("h1", "stop", "remove");
   classControl("h1", "danger", "remove");
   classControl("h1", "active", "remove");
   setCoundown("00", "00", "00");
   classControl(".controls", "active", "remove");
   coundownPicker.forEach( function( elem ) {
      elem.scrollTop = 0;
   });
}


function setCoundown( h, m, s ) {
   hElem.innerHTML = hElem.dataset["value"] = h;
   mElem.innerHTML = mElem.dataset["value"] = m;
   sElem.innerHTML = sElem.dataset["value"] = s;

   return { hour: h, minut: m, second: s };
}


startButton.addEventListener("click", function() {
   var hms = setCoundown(
      hElem.dataset["value"],
      mElem.dataset["value"],
      sElem.dataset["value"]
   );

   var match = {
      hour: +hElem.dataset["match"],
      minut: +mElem.dataset["match"],
      second: +sElem.dataset["match"]
   };

   classControl("h1", "active", "add");
   startCoundown( +hms.hour, +hms.minut, +hms.second, match );
});

stopButton.addEventListener("click", function() {
   classControl("h1", "danger", "remove");
   classControl("h1", "active", "remove");
   clearInterval( startInterval );
});

resetButton.addEventListener("click", function() {
   resetCoundown();
   clearInterval( startInterval );
});