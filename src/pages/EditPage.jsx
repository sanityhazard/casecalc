import '../App.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
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
  const { state } = useLocation()

  const saveFile = (name, price, items) => {
    const fileData = {
      name,
      price,
      items,
    };

    // Save file via API
    fetch(`${BASEURL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fileData),
    })
      .then(() => {
        alert(`Saved file "${name}"`);
      })
      .catch((error) => {
        console.error('Error saving to server:', error);
        alert('Failed to save file to server.');
      });

    // Download file to user's computer
    const blob = new Blob([JSON.stringify(fileData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.json`; // File name with .json extension
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


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
    const file = event.target.files[0]
    console.log(file)
    console.log("1")
    if (!file) {
      return
    };

    if (!file.name.endsWith(".json")) {
      alert("Only JSON config files are supported")
      return
    }

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result;
      let jsonContent = {}

      try {
        jsonContent = JSON.parse(fileContent)
      } catch (error) {
        console.log(error)
        alert("Your file might be corrupted, since the app can't read it")
        return
      }

      console.log(jsonContent)
      setUploadedFile(jsonContent)
    }

    reader.onerror = () => {
      alert('Failed to read file.');
    };

    reader.readAsText(file);
  }

  useEffect(() => {
    if (uploadedFile) {
      // Legacy code that was meant to deal with a different simulation runner
      if (uploadedFile?.data?.casePrice) {
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
        setPrice(uploadedFile.price);
        setItems(uploadedFile.items);
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

    if (state) {
      const { uploadedFileContent, uploadedFileName } = state
      setName(uploadedFileContent.name);
      setPrice(uploadedFileContent.price);
      setItems(uploadedFileContent.items);
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
      if (data?.error) {
        alert(`Error: ${data.error}`)
        setSimulationState(0)
        return
      }
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
                <h3>Simulation results</h3>
                <p>Winnings: {simulationResult.allCasinoWin}</p>
                <p>Avg. win: {Number(simulationResult.avgCasinoWin).toFixed(2)}</p>
                <p>Site's winrate: {`${simulationResult.casinoWinrate}%`}</p>
              </div>
            ) : <p>Загрузка симуляции...</p>
          )
        }
      </div>
    </div >
  )
}

export default EditPage
