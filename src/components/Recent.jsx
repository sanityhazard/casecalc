import { useEffect, useState } from "react";
import ButtonColumn from "./ButtonColumn";
import SmallButton from "./SmallButton";
import BASEURL from "../../config";
import { useNavigate } from "react-router-dom";


function Recent() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    // Step 1: Get the files from the API
    useEffect(() => {
        fetch(`${BASEURL}/files`)
            .then(response => response.json())
            .then(data => setFiles(data['files']))
            .catch(error => console.error('Error:', error));
    }, []);

    const openFile = (fileName) => {
        navigate(`/edit/${fileName}`);
    };

    // Step 2: Divide the list into three columns
    const columns = [[], [], []];
    files.forEach((file, index) => {
        const columnIndex = Math.floor(index / 6);
        columns[columnIndex].push(file);
    });

    // Step 3: Render the columns with the files
    return (
        <div className="recent">
            <h3>Недавние файлы:</h3>
            <div className="files">
               {columns.map((column, i) => (
                    <ButtonColumn key={i}>
                        {column.map((file, j) => (
                            <SmallButton key={j} openFile={() => openFile(file)} filename={file} />
                        ))}
                    </ButtonColumn>
                ))} 
            </div>
        </div>
    );
}

export default Recent;