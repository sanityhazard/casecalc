function Info({ winrate, payback, unallocated }) {
    return ( 
        <div className="info">
            <div className="info__item">
                Шанс выигрыша: {winrate}%
            </div>
            <div className="info__item">
                За кейс в среднем получим: {payback} рублей
            </div>
            <div className="info__item">
                Не распределено: {unallocated}%
            </div>
        </div>
     );
}

export default Info;