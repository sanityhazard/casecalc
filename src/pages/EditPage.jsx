import '../App.scss'
import { useParams } from 'react-router-dom'
import { HeaderEdit } from '../components/Header'
import Info from '../components/Info'
import Item from '../components/Item'
import ItemContainer from '../components/ItemContainer'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import BASEURL from '../../config'


function EditPage() {

  // fetch from the api later
  // console.log(id)
  // const items = [<Item />, <Item />, <Item />]

  const { filename } = useParams()
  
  const saveFile = (name, price, items) => {
    fetch(`${BASEURL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        price,
        items
      })
    })
    alert(`Файл ${name} сохранен`)
  }

  const createItem = (index = null) => {
    return {
      index: index ? index : 0,
      name: '',
      price: 0,
      dropRate: 0
    }
  }

  const [items, setItems] = useState([createItem(0), createItem(1), createItem(2)])
  const [unallocated, setUnallocated] = useState(100)
  const [price, setPrice] = useState(0)
  const [winrate, setWinrate] = useState(0)
  const [avgPayback, setAvgPayback] = useState(0)
  const [name, setName] = useState('')
  const [simulationState, setSimulationState] = useState(false)
  const [simulationResult, setSimulationResult] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const json = JSON.parse(contents);
      setUploadedFile({ name: file.name, data: json});
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (uploadedFile) {

      if (uploadedFile.data.casePrice) {
        setName(uploadedFile.name);
        setPrice(uploadedFile.data.casePrice);
        let newItems = []
        for (let i = 0; i < uploadedFile.data.items.length; i++) {
          console.log(uploadedFile.data.items[i])
          newItems.push({
            index: i,
            name: uploadedFile.data.items[i].name,
            price: uploadedFile.data.items[i].value,
            dropRate: uploadedFile.data.items[i].dropRate
          })
        }
        setItems(newItems)
      }
      else {
        setName(uploadedFile.name);
        setPrice(uploadedFile.data.price);
        setItems(uploadedFile.data.items);
      }
    }
  }, [uploadedFile]);

  useEffect(() => {
    if (filename) {
      fetch(`${BASEURL}/load/${filename}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setName(data['name'])
          setPrice(data['price'])
          setItems(data['items'])
        })
        .catch(error => console.error('Error:', error));
    }
  }, [])

  const handlePriceChange = (e) => {
    setPrice(e.target.value)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }
    
  const handleAdd = () => {
    const maxIndex = Math.max(...items.map((item) => item.index))
    setItems([...items, createItem(maxIndex + 1)])
  }

  const handleDelete = (index) => {
    setItems(items => items.filter((item) => index !== item.index))
  }

  const handleChange = (index, field, value) => {
    const newItems = [...items];
    const item = newItems.find((item) => item.index === index)
    item[field] = value
    setItems(newItems)
  };

  const simulate = (times) => {
    setSimulationState(1)
    fetch(`${BASEURL}/simulate?times=${times}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        price: price,
        items: items
      })
    }).then(response => response.json()).then(data => {
      setSimulationState(2)
      setSimulationResult(data)
    })
  }

  useEffect(() => {
    if (items) {
      setUnallocated((100 - items.reduce((acc, item) => acc + Number(item.dropRate), 0).toFixed(5)))
      setWinrate((items.reduce((acc, item) => acc + (Number(item.price) >= price ? Number(item.dropRate) : 0), 0)).toFixed(5))
      setAvgPayback((price - items.reduce((acc, item) => acc + Number(item.price) * (Number(item.dropRate) / 100), 0)).toFixed(2))
    }
  }, [items, price])
  
  if (!items) {
    return <div>Loading...</div>
  }

  return (
    <div className='center'>
      <div className="content-edit">
        <div className="info-section">
          <HeaderEdit />
          <Info winrate={winrate} payback={avgPayback} unallocated={unallocated} handleFileUpload={handleFileUpload} />
        </div>
        <ItemContainer handleAdd={handleAdd} handleChange={handleChange} handleDelete={handleDelete} setItems={setItems} items={items} />
        <Footer simulate={simulate} name={name} price={price} onPriceChange={handlePriceChange} onNameChange={handleNameChange} hasUnallocated={unallocated} saveFile={() => saveFile(name, price, items)} />
        { 
        [1, 2].includes(simulationState) &&
          (
            simulationState === 2 ? (
              <div className="simulation">
                <h3>Результаты симуляции:</h3>
                <p>Весь выигрыш: {simulationResult.allCasinoWin} руб</p>
                <p>Средний выигрыш: {Number(simulationResult.avgCasinoWin).toFixed(2)} руб</p>
                <p>Винрейт: {`${simulationResult.casinoWinrate}%`}</p>
              </div>
            ) : <p>Загрузка симуляции...</p>
          )
        }
        </div>
    </div >
  )
}

export default EditPage
