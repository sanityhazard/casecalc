import '../App.scss'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
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
  // const [name, setName] = useState('')

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
      setWinrate(items.reduce((acc, item) => acc + (Number(item.price) >= price ? Number(item.dropRate) : 0), 0))
      setAvgPayback((price - items.reduce((acc, item) => acc + Number(item.price) * (Number(item.dropRate) / 100), 0)).toFixed(2))
    }
  }, [items, price])
  
  if (!items) {
    return <div>Loading...</div>
  }

  return (
    <div className='container'>
      <Header />
      <Info winrate={winrate} payback={avgPayback} unallocated={unallocated} />
      <ItemContainer handleAdd={handleAdd} handleChange={handleChange} handleDelete={handleDelete} items={items} />
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
    </div >
  )
}

export default EditPage
