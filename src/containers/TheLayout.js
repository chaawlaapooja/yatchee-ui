import React, { useEffect } from 'react'
import {
  TheContent,
  TheSidebar,
  TheHeader
} from './index'

const TheLayout = (props) => {
  useEffect(()=>{
    if(window.localStorage.getItem('id')==='' || window.localStorage.getItem('id')===null){
      props.history.push('/')
    }
  },[props.history])
  useEffect(()=>{
    async function tryLogin(){
      let id = window.localStorage.getItem('id')
  
      if(id!==null || id!==''){
        let response = await fetch('https://yatchee.herokuapp.com/checkIfUserExist',{
          mode: 'no-cors',
          method:'POST',
          body: JSON.stringify({_id:id, checkFor:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
        })
        response = await response.json()
        if(response!=='true'){
          props.history.push('/')
        }
        else
          return
      }
    }
    tryLogin()
  },[props.history])

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader {...props}/>
        <div className="c-body">
          <TheContent/>
        </div>
      </div>
    </div>
  )
}

export default TheLayout
