import { useState, useRef, useEffect } from 'react';
import './App.css';
import $ from 'jquery'
import { useNavigate } from "react-router-dom";

//MSAL
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./Config";
import { callMsGraph } from "./graph";

//assets
import iredoc from './assets/img/iredoc.png'
import Button from "react-bootstrap/Button";

//components
import QRCoode from './QrCode'

function App() {
  let [name, setName] = useState("")
  let [midName, setMidName] = useState("")
  let [studentNum, setStudent] = useState("")
  let [guild, setGuild] = useState("")
  let [section, setSection] = useState("")
  let [data, setData] = useState("");
  let [isQRShown, setIsQRShown] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  const submitData = () => {
    setData(name + " " + midName + " [|] " + studentNum + " [|] " + guild + " [|] " + section);
    setIsQRShown(true);
  }

  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const isAuthenticated = useIsAuthenticated();
  const [accessToken, setAccessToken] = useState(null);


  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0]
    };
    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance.acquireTokenSilent(request).then((response) => {
      setAccessToken(response.accessToken);
      callMsGraph(response.accessToken).then(response => setGraphData(response));
    }).catch((e) => {
      instance.acquireTokenRedirect(request).then((response) => {
        setAccessToken(response.accessToken);
        callMsGraph(response.accessToken).then(response => setGraphData(response));
      });
    });
  }

  const handleLogin = (loginType) => {
    if (loginType === "popup") {
      try {
        instance.loginPopup(loginRequest)
      } catch (e) {
        console.log(e);
      }
    }
    else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });

    }
  }

  const handleLogout = (logoutType) => {
    if (logoutType === "popup") {
      instance.logoutPopup({
        postLogoutRedirectUri: "/lista-qr",
        mainWindowRedirectUri: "/lista-qr" // redirects the top level app after logout
      });
    }
    else if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/lista-qr",
      });
    }
  }

  useEffect(() => {
    if (isAuthenticated) { setIsLoggedIn(true); }
    else { setIsLoggedIn(false); }

    if (isLoggedIn && name.length < 2) {
      RequestProfileData();
    }

    if (accessToken) {
      setName(graphData.surname + ", " + graphData.givenName)
    }
  }, [graphData, isAuthenticated, isLoggedIn, name])


  return (
    <div className="App">
      <div>
        <hgroup>
          <h1>LISTA Attendance shit</h1>
          <h3>By Andrew Tate (Top G)</h3>
        </hgroup>
        {isAuthenticated ?
          <div div >
            <form>
              <p id='notes'>(*) means required fields.</p>
              <div className="group">
                <input id='name' type="text" value={name} disabled required /><span className="highlight" /><span className="bar" />
                <label>&thinsp; Name*</label>
              </div>
              <div className="group">
                <input onChange={e => setMidName(e.target.value)} id='midName' type="text" value={midName} required /><span className="highlight" /><span className="bar" />
                <label>Middle Name</label>
              </div>
              <div className="group">
                <input onChange={e => setStudent(e.target.value)} id='studentNum' type="text" value={studentNum} required /><span className="highlight" /><span className="bar" />
                <label>Student Number*</label>
              </div>
              <div className="group">
                <select onChange={e => setGuild(e.target.value)} value={guild} id="guild" required="required">
                  <option id='firstOpt' value="" disabled="disabled"></option>
                  <optgroup></optgroup>
                  <option value="ETIKA">ETIKA</option>
                  <optgroup></optgroup>
                  <option value="IREDOC">IREDOC</option>
                  <optgroup></optgroup>
                  <option value="LETRA">LETRA</option>
                  <optgroup></optgroup>
                  <option value="NUMERIKA">NUMERIKA</option>
                  <optgroup></optgroup>
                  <option value="SWES">SWES</option>
                  <optgroup></optgroup>
                </select>
                <label>&thinsp; Guild*</label>
              </div>
              <div className="group">
                <input onChange={e => setSection(e.target.value)} id="section" type="text" value={section} required /><span className="highlight" value={section} /><span className="bar" />
                <label>&thinsp; Section*</label>
              </div>
              <button onClick={submitData} type="button" className=" button buttonBlue">Submit
                <div className="ripples buttonRipples"><span className="ripplesCircle" /></div>
              </button>
            </form>
            <Button variant="primary" style={styles.signButton} className="signButton" onClick={() => { handleLogout("redirect") }}>SIGN OUT</Button>
          </div>
          :
          <Button variant="primary" style={styles.signButton} className="signButton" onClick={() => handleLogin("redirect")}>SIGN IN WITH YOUR STI 0365 ACCOUNT</Button>
        }
        {isQRShown && <QRCoode data={data} />
        }
        <footer><a href="http://www.facebook.com/cdrcspn" rel="noopener noreferrer" target="_blank"><img alt="IREDOC#1" src={iredoc} /></a>
          <p>STI LISTA Club. All Rights Reserved.</p>
        </footer>
      </div >

    </div >
  );
}
const styles = {

  signButton: {
    background: '#eb4626',
  }

}

/*Pre ung terms and service baka malimot*/






$(window, document, undefined).ready(function () {

  $('input').blur(function () {
    var $this = $(this);
    if ($this.val())
      $this.addClass('used');
    else
      $this.removeClass('used');
  });

  var $ripples = $('.ripples');

  $ripples.on('click.Ripples', function (e) {

    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.ripplesCircle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
      top: y + 'px',
      left: x + 'px'
    });

    $this.addClass('is-active');

  });

  $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function (e) {
    $(this).removeClass('is-active');
  });

});

export default App;