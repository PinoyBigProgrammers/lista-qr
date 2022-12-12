import React, { useEffect, useRef, useState } from "react"
import "./qr.css";
import QRCodeStyling from "qr-code-styling";

//styles
import Button from 'react-bootstrap/Button'

//assets
import iredoc from './assets/img/iredoc.png'


const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image: iredoc,
    //image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Iredoc2.svg",
    dotsOptions: {
        type: "extra-rounded",
        color: "#6a1a4c",
        gradient: {
            type: "linear",
            rotation: 0.7853981633974483,
            colorStops: [
                {
                    offset: 0,
                    color: "#007bff"
                },
                {
                    offset: 1,
                    color: "#f4d03f"
                }
            ]
        }
    },
    imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: true,
        margin: 5
    },
    dotsOptionsHelper: {
        colorType: {
            "single": true,
            "gradient": false
        },
        gradient: {
            linear: true,
            radial: false,
            color1: "#6a1a4c",
            color2: "#6a1a4c",
            rotation: 0
        }
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: "#f4d03f"
    },
    cornersSquareOptionsHelper: {
        colorType: {
            single: true,
            gradient: false
        },
        gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0"
        }
    },
    cornersDotOptions: {
        type: "dot",
        color: "#007bff"
    },
    cornersDotOptionsHelper: {
        colorType: {
            single: true,
            gradient: false
        },
        gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0"
        }
    },
    backgroundOptionsHelper: {
        colorType: {
            single: true,
            gradient: false
        },
        gradient: {
            linear: true,
            radial: false,
            color1: "#ffffff",
            color2: "#ffffff",
            rotation: "0"
        }
    }
});


export default function QrCode(props) {
    const [url, setUrl] = useState(props.data);
    const fileExt = "png"
    const ref = useRef(null);
    const acceptedEmail = require("crypto-js");
    let [finalEmail, setFinalEmail] = useState("");


    useEffect(() => {
        let qrdata = "";
        if (props.data["midName"]) {
            qrdata = props.data["name"] + " " + props.data["midName"][0].toUpperCase() + ". [|] " + props.data["studentNum"] + " [|] " + props.data["guild"] + " [|] " + props.data["section"]
        }
        else {
            qrdata = props.data["name"] + " [|] " + props.data["studentNum"] + " [|] " + props.data["guild"] + " [|] " + props.data["section"]
        }
        console.log(qrdata)
        setFinalEmail(acceptedEmail.AES.encrypt(qrdata, '@stamaria.sti.edu.ph').toString());
        // eslint-disable-next-line
    }, [props.data]);

    useEffect(() => {
        setUrl(finalEmail);
        qrCode.append(ref.current);
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, [finalEmail]);

    useEffect(() => {
        qrCode.update({
            data: url
        });

        let name = props.data["name"];
        let section = props.data["section"];

        qrCode.getRawData("png")
            .then(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    let b64 = reader.result;

                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: name,
                            section: section,
                            qrcode: b64
                        })
                    };

                    fetch('https://lista.deta.dev/api', requestOptions)
                        .then(response => response.json())
                        .then(data => this.setState({ postId: data.id }));
                }
            });

        console.log(url);
    }, [url]);

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };



    return (
        <div className="QR-section">
            <div style={styles.QRsection} ref={ref} />
            <Button style={styles.dwnloadBtn} variant="primary" onClick={onDownloadClick}>Download</Button>
        </div>
    );
}

const styles = {
    dwnloadBtn: {
        marginTop: '50px',
        width: '100%'
    },

    QRsection: {
        marginTop: '50vh'
    }
};

