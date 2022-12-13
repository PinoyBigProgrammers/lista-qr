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
    margin: 5,
    image: iredoc,
    //image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Iredoc2.svg",
    dotsOptions: {
        type: "extra-rounded",
        color: '#0b5793'
    },
    imageOptions: {
        crossOrigin: "anonymous",
        hideBackgroundDots: true
    },
    cornersSquareOptions: {
        type: "extra-rounded",
        color: '#0b5793'
    },
    cornersDotOptions: {
        type: "dot",
        color: '#0b5793'
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

        // Wait to make sure qrcode has finished rendering
        setTimeout(() => {
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
                                name: { name },
                                section: { section },
                                qrcode: { b64 }
                            })
                        };

                        fetch('https://lista.deta.dev/api', requestOptions)
                            .then(response => response.json())
                            .then(data => this.setState({ postId: data.id }));
                    }
                });

        }, 1000)
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

