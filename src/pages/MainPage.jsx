import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import '../App.scss'
import SmallButton from '../components/SmallButton'
import BigButton from '../components/BigButton'
import Choice from '../components/Choice'
import { HeaderMain } from '../components/Header'
import Recent from '../components/Recent'

function MainPage() {
  return (
    <div className='roboto-flex center'>
      <div className="content-main">
        <HeaderMain />
        <div className="buttons">
          <button id="main">Create config</button>
          <button id="secondary">Load config</button>
        </div>
      </div>
    </div>
  );
}

export default MainPage
