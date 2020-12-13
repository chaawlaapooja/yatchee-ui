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
  CRow,
  CDataTable,
  CForm
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const fields = ['email', 'delete']

const Admin = () => {
  const [admins, setAdmins] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  async function getAdmins() {
    let response = await fetch('https://yatchee.herokuapp.com/fetch/users/admin')
    response = await response.json()
    response = response.filter(doc=>doc._id!==localStorage.getItem('id'))
    setAdmins(response)
  }

  useEffect(()=>{
    getAdmins()
  },[admins])

  const resetInputFields = () => {
      setEmail('')
      setPassword('')
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    var reg = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$")
    if(!reg.test(email)){
        addToast('Error', 'Please enter a valid email', 'bg-danger')
        return
    }
    if(password.length<6){
        addToast('Error', 'Please enter a 6 char long password', 'bg-danger')
        return
    }
    let response = await fetch('https://yatchee.herokuapp.com/signup',{
          method:'POST',
          body: JSON.stringify({email,password,designation:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    if(typeof(response)==='object'){
      addToast('Success', 'Admin added succesfully', 'bg-success')
      resetInputFields()
    } else {
      addToast('Error', 'Some error occurred! Try again later...', 'bg-danger')
    }
  }

  const handleDelete = async (item) => {
    const {_id} = item
    let answer = window.confirm('Are you sure you want to delete this service?')
    if(answer){
      let response = await fetch('https://yatchee.herokuapp.com/removeWashTypeOrService',{
        method:'POST',
        body: JSON.stringify({remove:'admin', _id}),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      response = await response.json()
      if(response==='success'){
        addToast('Success', 'Admin deleted succesfully', 'bg-success')
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
              Add New Admins
            </CCardHeader>
            <CCardBody>
              <CForm className="form-horizontal">
                <CFormGroup row>
                  <CCol md="12">
                    <CInputGroup>
                      <CInput type="email" pattern="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/" value={email} onChange={(e)=>setEmail(e.target.value)} id="input2-group1" name="input2-group1" placeholder="Unique admin email" required/>
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="12">
                    <CInputGroup>
                      <CInput id="input3-group1" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} name="input3-group1" placeholder="6 char password" />
                    </CInputGroup>
                  </CCol>
                </CFormGroup>
              </CForm>
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
                <span>Admins</span>
                <span>Number of admins other than you: {admins.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={admins}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
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
    </>
  )
}

export default Admin
