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
                        <label htmlFor="winrate">Винрейт:</label>
                        <input type="text" id="winrate" name="winrate" />
                    </form>
                    <button disabled>Сгенерировать</button>
                </div>
                <div>
                    <form>
                        <label htmlFor="simulate">Симулировать (раз):</label>
                        <input type="text" id="simulate" name="simulate" onChange={handleSimulateChange} />
                    </form>
                    <button disabled={hasUnallocated} onClick={() => {simulate(simulateValue)}}>Запустить</button>
                </div>
                <div>
                    <form>
                        <label htmlFor="filename">Название:</label>
                        <input type="text" id="filename" name="filename" onChange={onNameChange} value={name} />
                    </form>
                    <button onClick={saveFile}>Сохранить</button>
                </div>
                <div>
                    <form>
                        <label htmlFor="price">Цена:</label>
                        <input type="text" id="price" name="price" onChange={onPriceChange} value={price ? price : ''} />
                    </form>
                </div>
            </div>
            <p className="reminder">
                И помните: Империя заботится о вас!
            </p>
        </footer>
     );
}

export default Footer;