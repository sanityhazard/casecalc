function Item({ item, index, handleChange, handleDelete }) {
    return ( 
        <div>
            <div className="item_grid">
                <div className="div1">
                    <label htmlFor="name">Название</label>
                    <input className="input1" type="text" id="name" name="name" onChange={(e) => handleChange(index, 'name', e.target.value)} value={item.name} />
                </div>
                <div className="div2">
                    <label htmlFor="price">Цена</label>
                    <input className="input2" type="text" id="price" name="price" onChange={(e) => handleChange(index, 'price', e.target.value)} value={item.price} />
                </div>
                <div className="div3">
                    <label htmlFor="chance">Шанс выпадения</label>
                    <input className="input2" type="text" id="dropRate" name="dropRate" onChange={(e) => handleChange(index, 'dropRate', e.target.value)} value={item.dropRate} />
                </div>
            </div>
            <button className="button__small__delete" onClick={() => handleDelete(index)}>Удалить</button>
        </div>
     );
}

export default Item;