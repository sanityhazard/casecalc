function Item({ item, index, handleChange, handleDelete }) {
    return ( 
        <div className="wrapper nodrag" draggable={false} onDragStart={event => event.preventDefault()}>
            <div className="item_grid">
                <div className="div1" onDragStart={event => event.preventDefault()}>
                    <label htmlFor="name">Name</label>
                    <input className="input1" type="text" id="name" name="name" onChange={(e) => handleChange(index, 'name', e.target.value)} value={item.name} />
                </div>
                <div className="div2" onDragStart={event => event.preventDefault()}>
                    <label htmlFor="price">Price</label>
                    <input className="input2" type="text" id="price" name="price" onChange={(e) => handleChange(index, 'price', e.target.value)} value={item.price} />
                </div>
                <div className="div3" onDragStart={event => event.preventDefault()}>
                    <label htmlFor="chance">Drop rate</label>
                    <input className="input2" type="text" id="dropRate" name="dropRate" onChange={(e) => handleChange(index, 'dropRate', e.target.value)} value={item.dropRate} />
                </div>
            </div>
            <button className="button_delete" onClick={() => handleDelete(index)}>Remove</button>
        </div>
     );
}

export default Item;