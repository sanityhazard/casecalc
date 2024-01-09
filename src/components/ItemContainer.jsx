import Item from "./Item";

function ItemContainer({ handleAdd, handleChange, handleDelete, items }) {
    return ( 
        <div className="item_container">
            { items.map((item) => {
                return (
                    <Item
                        item={item}
                        key={item.index}
                        index={item.index}
                        handleDelete={handleDelete}
                        handleChange={handleChange}/>
                )
            })}
            <button className="add_button" onClick={handleAdd}>
                +
            </button>
            <div className="frame">
            </div>
        </div>
    );
}

export default ItemContainer;