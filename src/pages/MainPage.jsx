import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import '../App.scss'
import SmallButton from '../components/SmallButton'
import BigButton from '../components/BigButton'
import Choice from '../components/Choice'
import Header from '../components/Header'
import Recent from '../components/Recent'

function MainPage() {

  return (
    <div className='container'>
      <Header />
      <Choice>
        <BigButton func={"Создать новый конфиг"}/>
        <BigButton func={"Открыть конфиг"}/>
      </Choice>
      <Recent />
    </div >
  )
}

export default MainPage
