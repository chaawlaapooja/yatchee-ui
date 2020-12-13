import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupPrepend,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'


const CheckupCost = () => {
  const [checkupCost, setCheckupCost] = useState([])
  const [price, setPrice] = useState(1)
  const [toasts, setToasts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  
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

  async function getCheckupCost() {
    let response = await fetch('https://yatchee.herokuapp.com/getCheckupCost')
    response = await response.json()
    setCheckupCost(response)
    setPrice(response)
  }

  useEffect(()=>{
    getCheckupCost()
  },[checkupCost])

  const handleEditEvent = async (e) => {
    e.preventDefault()
    let response = await fetch('https://yatchee.herokuapp.com/updateCheckupCost',{
        method:'POST',
        body: JSON.stringify({cost:price}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    response = await response.json()
    if(response==='success'){
      addToast('Success', 'Check up cost updated succesfully', 'bg-success')
      setCheckupCost(price)
      setIsModalOpen(!isModalOpen)
    } else {
      addToast('Error', 'Some error occurred! Try again later...', 'bg-danger')
    
    }
    
  }
  
  const openModaltoHandleEdit = () => {
    setIsModalOpen(true)
  }

  return (
    <>
    <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <CCol xs="12" lg="6">
            <CCard>
                <CCardHeader>
                Check up cost
                </CCardHeader>
                <CCardBody style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span>{checkupCost}</span>
                    <span>    
                        <CButton type="submit" size="sm" color="info" onClick={()=>openModaltoHandleEdit()}> Edit</CButton>
                    </span>
                </CCardBody>
            </CCard>
        </CCol>
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
      <CModal 
        show={isModalOpen} 
        onClose={() => setIsModalOpen(!isModalOpen)}
        color="info"
      >
        <CModalHeader closeButton>
          <CModalTitle>Edit Wash type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol xs="12" md="12">
            <form onSubmit={(e)=>handleEditEvent(e)} className="form-horizontal">
              <CFormGroup row>
                <CCol md="12">
                  <CInputGroup>
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        $
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput id="input3-group1" type="number" min='1' value={price} onChange={(e)=>setPrice(e.target.value)} name="input3-group1" placeholder=".." />
                    <CInputGroupAppend>
                      <CInputGroupText>.00</CInputGroupText>
                    </CInputGroupAppend>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
            </form>
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {setIsModalOpen(!isModalOpen)}}>Cancel</CButton>
          <CButton color="info" onClick={handleEditEvent}>Edit</CButton>{' '}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default CheckupCost
