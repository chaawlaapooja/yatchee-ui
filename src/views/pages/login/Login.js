import React, { useEffect, useState } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CToast,
  CToastHeader,
  CToastBody,
  CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toasts, setToasts] = useState([])
  
  const toasters = (()=>{
      return toasts.reduce((toasters, toast) => {
        toasters[toast.position] = toasters[toast.position] || []
        toasters[toast.position].push(toast)
        return toasters
      }, {})
  })()

  const addToast = (title, message,color) => {
      setToasts([
        ...toasts, 
        { position:'top-right', title, message, color, autohide : 4000, closeButton:true, fade:true }
      ])
  }
  useEffect(()=>{
    let id = window.localStorage.getItem('id')
    async function tryLogin(){
      if(id!==null || id!==''){
        let response = await fetch('https://yatchee.herokuapp.com/checkIfUserExist',{
          method:'POST',
          body: JSON.stringify({_id:id, checkFor:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
        })
        response = await response.json()
        if(response==='true'){
          props.history.push('/dashboard')
        }
        else
          return
      }
    }
    tryLogin()
  },[props.history])

  const handleForgotPassword = async() => {
    let response = await fetch('https://yatchee.herokuapp.com/forgotPassword',{
        method:'POST',
        body: JSON.stringify({email, newPassword:'123456', designation:'admin'}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    response = await response.json()
    if(response==='password updated successfully'){
      addToast('Success', 'Password updated succesfully! Your new Password is 123456. Change it once you login', 'bg-success')
    } else {
      addToast('Error', `Some error occurred! Try again later...Seems ${response}`, 'bg-danger')
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    let response = await fetch('https://yatchee.herokuapp.com/login',{
      method:'POST',
      body: JSON.stringify({email:email,password:password,designation:'admin'}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    response = await response.json()
    if(response==='Admin not found')
      setError('No admin found with this address. Did you misspell it?')
    else if(response==='Wrong password')
      setError('Wrong password')
    else{
      window.localStorage.setItem('id',response._id)
      props.history.push('/dashboard')
    }
  }
  return (
    <>
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={(e)=>handleLogin(e)}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    {error?<p style={{color:'red'}}>{error}</p>:undefined}
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <input type="submit" style={{backgroundColor:'#321fdb', color:'#fff'}} className="px-4" value='Login'/>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0" onClick={handleForgotPassword}>Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
              
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
    <CCol sm="12" lg="6">
              {Object.keys(toasters).map((toasterKey) => (
                <CToaster
                  position={toasterKey}
                  key={'toaster' + toasterKey}
                >
                  {
                    toasters[toasterKey].map((toast, key)=>{
                    return(
                      <CToast
                        key={'toast' + key}
                        show={true}
                        autohide={toast.autohide}
                        fade={toast.fade}
                        className={toast.color}
                        style={{color:'#fff'}}
                      >
                        <CToastHeader closeButton={toast.closeButton}>
                          {toast.title}
                        </CToastHeader>
                        <CToastBody>
                          {toast.message}
                        </CToastBody>
                      </CToast>
                    )
                  })
                  }
                </CToaster>
              ))}
      </CCol>
    
    </>
  )
}

export default Login
