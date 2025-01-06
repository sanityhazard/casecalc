import { useEffect, useState } from "react";
import ButtonColumn from "./ButtonColumn";
import SmallButton from "./SmallButton";
import BASEURL from "../../config";
import { useNavigate } from "react-router-dom";


function Recent() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${BASEURL}/files`)
            .then(response => response.json())
            .then(data => setFiles(data['files']))
            .catch(error => console.error('Error:', error));
    }, []);

    const openFile = (fileName) => {
        navigate(`/edit/${fileName}`);
    };

    return (
        <div className="recent">
            <h3>Recent files:</h3>
            <div className="files">
                {files.map((file, j) => (
                    <SmallButton key={j} openFile={() => openFile(file)} filename={file} />
                ))}
            </div>
        </div>
    );
}

export default Recent;