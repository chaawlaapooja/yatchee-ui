import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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
  CRow,
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const fields = ['name','pricePerFeet', 'edit', 'delete']

const WashTypes = () => {
  const [washTypes, setWashTypes] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState(1)
  const [toasts, setToasts] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [washTypeToEdit, setWashTypeToEdit] = useState({})
  
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

  async function getwashTypes() {
    let response = await fetch('https://yatchee.herokuapp.com/fetch/washType')
    response = await response.json()
    setWashTypes(response)
  }

  useEffect(()=>{
    getwashTypes()
  },[washTypes])

  const resetInputFields = () => {
    setName('')
    setPrice(1)
  }
  const handleEditEvent = async (e) => {
    e.preventDefault()
    
    const {_id} = washTypeToEdit
    let response = await fetch('https://yatchee.herokuapp.com/updateWashTypeOrService',{
      method:'POST',
      body: JSON.stringify({edit:'washType', _id, name, price}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    response = await response.json()
    if(response==='success'){
      addToast('Success', 'Wash type updated succesfully', 'bg-success')
      resetInputFields()
      setWashTypeToEdit({})
      setIsModalOpen(!isModalOpen)
    } else {
      addToast('Error', 'Some error occurred! Try again later...', 'bg-danger')
    
    }
    
  }
  const handleAdd = async (e) => {
    e.preventDefault()
    let response = await fetch('https://yatchee.herokuapp.com/addWashTypeOrService',{
      method:'POST',
      body: JSON.stringify({name, price, addTo:'washType'}),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    response = await response.json()
    if(response==='success'){
      addToast('Success', 'Wash type added succesfully', 'bg-success')
      resetInputFields()
    } else {
      addToast('Error', 'Some error occurred! Try again later...', 'bg-danger')
    }
  }
  const openModaltoHandleEdit = (item) => {
    setWashTypeToEdit(item)
    setName(item.name)
    setPrice(parseInt(item.pricePerFeet))
    setIsModalOpen(true)
  }

  const handleDelete = async (item) => {
    const {_id} = item
    let answer = window.confirm('Are you sure you want to delete this wash type?')
    if(answer){
      let response = await fetch('https://yatchee.herokuapp.com/removeWashTypeOrService',{
        method:'POST',
        body: JSON.stringify({remove:'washType', _id}),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      response = await response.json()
      if(response==='success'){
        addToast('Success', 'Wash type deleted succesfully', 'bg-success')
      } else{
        alert('err')
      }
    }
  }
  return (
    <>
      <CRow style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <CCol xs="12" md="6">
          <CCard>
            <CCardHeader>
              Add Wash Types
            </CCardHeader>
            <CCardBody>
              <form onSubmit={(e)=>handleAdd(e)} className="form-horizontal">
                <CFormGroup row>
                  <CCol md="12">
                    <CInputGroup>
                      <CInput type="text" value={name} onChange={(e)=>setName(e.target.value)} id="input2-group1" name="input2-group1" placeholder="Name of wash type" required/>
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
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
            </CCardBody>
            <CCardFooter style={{display:'flex', justifyContent:'space-around'}}>
              <CButton type="submit" size="sm" color="success" onClick={handleAdd}><CIcon name="cil-scrubber" /> Submit</CButton>
              <CButton type="reset" size="sm" color="danger" onClick={resetInputFields}><CIcon name="cil-ban" /> Reset</CButton>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader style={{display:'flex', justifyContent:'space-between'}}>
                <span>Wash Types</span>
                <span>Number of wash types : {washTypes.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={washTypes}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'pricePerFeet':
                (item)=>(
                  <td>$ {item.pricePerFeet}
                  </td>
                ),
                'edit':
                (item)=>(
                  <td>
                    <CButton type="submit" size="sm" color="info" onClick={()=>openModaltoHandleEdit(item)}> Edit</CButton>
                  </td>
                ),
                'delete':
                (item)=>(
                  <td>
                    <CButton type="submit" size="sm" color="danger" onClick={()=>handleDelete(item)}> Delete</CButton>
                  </td>
                ),
              }}
            />
            </CCardBody>
          </CCard>
      </CCol>
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
            <CForm className="form-horizontal">
              <CFormGroup row>
                <CCol md="12">
                  <CInputGroup>
                    <CInput type="text" value={name} onChange={(e)=>setName(e.target.value)} id="input2-group1" name="input2-group1" placeholder="Name of wash type" required/>
                    <CInputGroupAppend>
                      <CInputGroupText>
                        <CIcon name="cil-envelope-closed" />
                      </CInputGroupText>
                    </CInputGroupAppend>
                  </CInputGroup>
                </CCol>
              </CFormGroup>
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
            </CForm>
          </CCol>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => {setIsModalOpen(!isModalOpen); resetInputFields()}}>Cancel</CButton>
          <CButton color="info" onClick={handleEditEvent}>Edit</CButton>{' '}
        </CModalFooter>
      </CModal>
    </>
  )
}

export default WashTypes
