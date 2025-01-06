function Info({ winrate, payback, unallocated, handleFileUpload }) {
    return ( 
        <div className="info">
            <div className="info__item winrate">
                Winrate: {winrate}%
            </div>
            <div className="info__item average">
                Average payback: {payback}
            </div>
            <div className="info__item unallocated">
                Unallocated: {unallocated}%
            </div>
            <input type="file" onChange={handleFileUpload} className="info__item load-button" />
        </div>
     );
}

export default Info;