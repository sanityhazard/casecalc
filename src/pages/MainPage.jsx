import { useRef, useState } from 'react'
import reactLogo from '../assets/react.svg'
import '../App.scss'
import SmallButton from '../components/SmallButton'
import BigButton from '../components/BigButton'
import Choice from '../components/Choice'
import { HeaderMain } from '../components/Header'
import Recent from '../components/Recent'
import { useNavigate } from 'react-router-dom'

function MainPage() {
  const fileInputRef = useRef();
  const nav = useNavigate();

  const handleChange = (event) => {
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
      nav('/edit/', { state: { uploadedFileContent: jsonContent, uploadedFileName: file.name } });
    }

    reader.onerror = () => {
      alert('Failed to read file.');
    };

    reader.readAsText(file);
  }

  return (
    <div className='roboto-flex center'>
      <div className="content-main">
        <HeaderMain />
        <div className="buttons">
          <button id="main" onClick={() => nav('/edit/')}>Create config</button>
          <button id="secondary" onClick={() => fileInputRef.current.click()}>Load config</button>
        </div>
        <h2>Recently saved files will be shown here in a self-hosted version. This function is disabled right now for safety reasons.</h2>
        <Recent />
        <input onChange={handleChange} multiple={false} ref={fileInputRef} type='file' hidden />
      </div>
    </div>
  );
}

export default MainPage
