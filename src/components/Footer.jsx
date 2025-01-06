import { useState } from "react";

function Footer({ name, price, saveFile, hasUnallocated, onPriceChange, onNameChange, simulate }) {
    const [simulateValue, setSimulateValue] = useState('');

    const handleSimulateChange = (event) => {
        setSimulateValue(event.target.value);
    };
    return (
        <footer>
            <div className="functional">
                <div>
                    <form>
                        <label htmlFor="simulate">Simulate (times):</label>
                        <input type="text" id="simulate" name="simulate" onChange={handleSimulateChange} />
                        <p className={hasUnallocated ? "" : "secondary"}>Requires 0% unallocated</p>
                    </form>
                    <button disabled={hasUnallocated} onClick={() => { simulate(simulateValue) }}>Run simulation</button>
                </div>
                <div>
                    <form>
                        <label htmlFor="filename">Name:</label>
                        <input type="text" id="filename" name="filename" onChange={onNameChange} value={name} />
                        <label htmlFor="price">Price:</label>
                        <input type="text" id="price" name="price" onChange={onPriceChange} value={price ? price : ''} />
                    </form>
                    <button onClick={saveFile}>Save config</button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;