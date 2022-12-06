import React, { useEffect, useRef, useState } from "react"
import "./qr.css";
import QRCodeStyling from "qr-code-styling";

//styles
import Button from 'react-bootstrap/Button'


const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Iredoc2.svg",
    dotsOptions: {
        color: "#0b5793",
        type: "rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5
    }
});


export default function QrCode(props) {
    const [url, setUrl] = useState(props.data);
    const fileExt = "png"
    const ref = useRef(null);
    const acceptedEmail = require("crypto-js");
    let [finalEmail, setFinalEmail] = useState("");


    useEffect(() => {
        setFinalEmail(acceptedEmail.AES.encrypt(props.data, '@stamaria.sti.edu.ph').toString());
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

