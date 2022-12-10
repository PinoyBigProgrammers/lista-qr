import { useState, useEffect } from 'react';
import './App.css';

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

  let [inputErrors, setInputErrors] = useState({
    midName: '',
    studentNum: '',
    guild: '',
    section: ''
  });

  const inputHandler = (e) => {
    if (e.target.id === 'midName') {
      setMidName(e.target.value[0].toUpperCase() + ".")
    }
    else if (e.target.id === 'studentNum') {
      const value = e.target.value.replace(/\D/g, '');
      setStudent(value)
    }
    else if (e.target.id === 'guild') {
      setGuild(e.target.value)
    }
    else if (e.target.id === 'section') {
      setSection(e.target.value)
    }
    setInputErrors(prevV => {
      return { ...prevV, [e.target.id]: '' }
    })
  }

  const submitData = (e) => {
    e.preventDefault();
    if (isEmptyOrSpaces(studentNum) || isEmptyOrSpaces(guild) || isEmptyOrSpaces(section)) {
      if (isEmptyOrSpaces(studentNum)) {
        setInputErrors({
          ...inputErrors,
          studentNum: "This field cannot be empty"
        });
      }
      else if (isEmptyOrSpaces(guild)) {
        setInputErrors({
          ...inputErrors,
          guild: "This field cannot be empty"
        });
      }
      else if (isEmptyOrSpaces(section)) {
        setInputErrors({
          ...inputErrors,
          section: "This field cannot be empty"
        });
      }
    }
    else {
      setData(name + " " + midName + " [|] " + studentNum + " [|] " + guild + " [|] " + section);
      setIsQRShown(true);
    }
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
    if (loginType === "redirect") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.log(e);
      });

    }
  }

  const handleLogout = (logoutType) => {
    if (logoutType === "redirect") {
      instance.logoutRedirect({
        postLogoutRedirectUri: "/lista-qr",
      });
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoggedIn(true);
      if (isLoggedIn && name.length < 2) {
        RequestProfileData();
      }
    }
    else {
      setIsLoggedIn(false);
    }

    if (accessToken) {
      setName(graphData.surname + ", " + graphData.givenName)
    }
    // eslint-disable-next-line
  }, [graphData, isAuthenticated, isLoggedIn, name.length]);

  //let b64 = "";
  useEffect(() => {
    if (isQRShown) {
      //b64 = QRCoode.qrCode._canvas.toDataURL();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: { name },
          section: { section },
          guild: { guild }
          //qrcode: { b64 }
        })
      };
      console.log(requestOptions)
      fetch('https://lista.deta.dev/api', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
    }
  }, [isQRShown]);

  return (
    <div className="App">
      <div>
        <hgroup>
          <h1>LISTA Attendance shit</h1>
          <h3>By Andrew Tate (Top G)</h3>
        </hgroup>
        {accessToken ?
          <div div >
            <form action='#' onSubmit={submitData}>
              <p id='notes'>(*) means required fields.</p>
              <div className="group">
                <input id='name' type="text" value={name} disabled required /><span className="highlight" /><span className="bar" />
                <label>&thinsp; Name*</label>
              </div>
              <div className="group">
                <input onChange={inputHandler} id='midName' type="text" value={midName} required /><span className="highlight" /><span className="bar" />
                <label>Middle Name</label><span className='error'>{inputErrors.midName} </span>
              </div>
              <div className="group">
                <input onChange={inputHandler} id='studentNum' type="text" value={studentNum} required /><span className="highlight" /><span className="bar" />
                <label>Student Number*</label><span className='error'>{inputErrors.studentNum} </span>
              </div>
              <div className="group">
                <select onChange={inputHandler} value={guild} id="guild" required="required">
                  <option id='firstOpt' value="" disabled="disabled"></option>
                  <optgroup label="Guilds"></optgroup>
                  <option value="ETIKA">ETIKA</option>
                  <optgroup></optgroup>
                  <option value="IREDOC">IREDOC</option>
                  <optgroup></optgroup>
                  <option value="LETRA">LETRA</option>
                  <optgroup></optgroup>
                  <option value="NUMERIKA">NUMERIKA</option>
                  <optgroup></optgroup>
                  <option value="SWES">SWES</option>
                </select>
                <label>&thinsp; Guild*</label><span className='error'>{inputErrors.guild} </span>
              </div>
              <div className="group">
                <select onChange={inputHandler} value={section} id="section" required="required">
                  <option id='firstOpt' value="" disabled="disabled"></option>
                  <optgroup label="Grade 11"></optgroup>
                  <optgroup></optgroup>
                  <option value="ABM1101">ABM 1101</option>
                  <optgroup></optgroup>
                  <option value="HUMMS1101">HUMMS 1101</option>
                  <optgroup></optgroup>
                  <option value="STEM1101">STEM 1101</option>
                  <optgroup></optgroup>
                  <option value="STEM1102">STEM 1102</option>
                  <optgroup></optgroup>
                  <option value="ITM1101">ITM 1101</option>
                  <optgroup></optgroup>
                  <option value="GAS1101">GAS 1101</option>
                  <optgroup></optgroup>
                  <option value="DA1101">DA 1101</option>
                  <optgroup></optgroup>
                  <option value="CA1101">CA 1101</option>
                  <optgroup></optgroup>
                  <optgroup label='Grade 12'></optgroup>
                  <optgroup></optgroup>
                  <option value="ABM1201">ABM 1201</option>
                  <optgroup></optgroup>
                  <option value="HUMMS1201">HUMMS 1201</option>
                  <optgroup></optgroup>
                  <option value="STEM1201">STEM 1201</option>
                  <optgroup></optgroup>
                  <option value="STEM1202">STEM 1202</option>
                  <optgroup></optgroup>
                  <option value="ITM1201">ITM 1201</option>
                  <optgroup></optgroup>
                  <option value="GAS1201">GAS 1201</option>
                  <optgroup></optgroup>
                  <option value="DA1201">DA 1201</option>
                  <optgroup></optgroup>
                  <option value="CA1201">CA 1201</option>
                </select>
                <label>&thinsp; Section*</label><span className='error'>{inputErrors.section} </span>
              </div>
              <button onClick={submitData} type="submit" className=" button buttonBlue">Submit
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

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

/*Pre ung terms and service baka malimot*/

export default App;