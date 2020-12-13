import React, { useState } from 'react'
import {
  CToast,
  CToastHeader,
  CToastBody,
  CToaster,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CModalFooter,
  CButton

} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheHeaderDropdown = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
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
      { position:'top-right', title, message, color, autohide : 2000, closeButton:true, fade:true }
    ])
  }
  const handlePasswordChange = async () => {
    const id = window.localStorage.getItem('id')
    let response = await fetch('http://localhost:3001/changePassword',{
        method:'POST',
        body: JSON.stringify({_id:id, oldPassword:oldPassword, newPassword:newPassword, designation:'admin'}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    response = await response.json()
    if(response==='password updated successfully'){
      addToast('Success', 'Password updated succesfully', 'bg-success')
      resetInputFields()
      setIsModalOpen(!isModalOpen)
    } else {
      addToast('Error', `Some error occurred! Try again later...Seems you have ${response}`, 'bg-danger')
    }
  }
  const handleLogout = () => {
    window.localStorage.removeItem('id')
    props.history.push('/')
  }
  const resetInputFields = () => {
    setOldPassword('')
    setNewPassword('')
  }
  return (
  <>
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
      
      <CModal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(!isModalOpen)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Change password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol xs="12" md="12">
            <CForm className="form-horizontal">
              <CFormGroup row>
                <CCol md="12">
                  <CInputGroup>
                    <CInput type="text" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} id="input2-group1" name="input2-group1" placeholder="Old password" required/>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="12">
                  <CInputGroup>
                    <CInput id="input3-group1" type="text" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} name="input3-group1" placeholder="New password" />
                  </CInputGroup>
                </CCol>
              </CFormGroup>
            </CForm>
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {setIsModalOpen(!isModalOpen); resetInputFields()}}>Cancel</CButton>
          <CButton color="info" onClick={handlePasswordChange}>Change Password</CButton>{' '}
        </CModalFooter>
      </CModal>
    
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={'avatars/7.jpg'}
            className="c-avatar-img"
            alt="admin"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem onClick={()=>setIsModalOpen(true)}>
          <CIcon name="cil-settings" className="mfe-2" /> 
          Change password
        </CDropdownItem>
        
        <CDropdownItem divider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon name="cil-lock-locked" className="mfe-2" /> 
          Log out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  </>
  )
}

export default TheHeaderDropdown
