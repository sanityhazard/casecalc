function SmallButton({ filename, openFile }) {
    return ( 
        <button className="button__small" onClick={openFile}>{ filename }</button>
     );
}

export default SmallButton;