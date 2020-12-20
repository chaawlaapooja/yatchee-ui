import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster
} from '@coreui/react'

const fields = ['jobID',  'washType', 'service', 'requestedBy', 'acceptedBy', 'transactionID', 'checkupCost', 'subtotal', 'total', 'washScheduledAt', 'jobRequestedAt', 'refund']

const RefundPayment = () => {
  const [users, setUsers] = useState([])
  const [refundedWashes, setRefundedWashes] = useState([])
  const [toasts, setToasts] = useState([])
  
  async function getUsers() {
    let response = await fetch('https://yatchee.herokuapp.com/fetchWash',{
          method:'POST',
          body: JSON.stringify({forWhom:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    let responseNonRefunded = (response.filter(wash=>wash.isCancelled===true && wash.paidOn===null))
    let responseRefunded = (response.filter(wash=>wash.isCancelled===true && wash.paidOn))
    setUsers(responseNonRefunded)
    setRefundedWashes(responseRefunded)
  }

  useEffect(()=>{
    getUsers()
  },[])

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
  const handleRefund = async(_id) => {
    let response = await fetch('https://yatchee.herokuapp.com/makePayment',{
          method:'POST',
          body: JSON.stringify({_id, purpose:'refund'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    if(response==='success'){
        getUsers()
        addToast('Success', 'Refunded succesfully', 'bg-success')
    }
    else
        addToast('Error', 'Error refunding', 'bg-error')
  }
  return (
    <>
      <CCol xs="12" lg="12">                
          <CCard>
            <CCardHeader style={{display:'flex', justifyContent:'space-between'}}>
                <span>Pending Refunds</span>
                <span>Number of pending refunds : {users.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={users}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'total':
                (item)=>(
                  <td>
                      {item.subtotal + item.checkupCost}
                  </td>
                ),
                'requestedBy':
                (item)=>(
                  <td>
                      {item.userInfo.name}
                  </td>
                ),
                'acceptedBy':
                (item)=>(
                  <td>
                      {item.vendorInfo?item.vendorInfo.firstName+' '+item.vendorInfo.lastName:'---'}
                  </td>
                ),
                'jobRequestedAt':
                (item)=>(
                  <td>
                      {new Date(item.requestedAt).toLocaleString()}
                  </td>
                ),
                'washScheduledAt':
                (item)=>(
                  <td>
                      {new Date(item.time).toLocaleString()}
                  </td>
                ),
                'refund':
                (item)=>(
                    <td>
                        <CButton type="submit" size="sm" color="info" onClick={()=>handleRefund(item._id)}> Refund </CButton>
                    </td>
                ),
              }}
            />
            </CCardBody>
          </CCard>
      </CCol>

      <CCol xs="12" lg="12">                
          <CCard>
            <CCardHeader style={{display:'flex', justifyContent:'space-between'}}>
                <span>Refunded Washes</span>
                <span>Number of refunded payments : {refundedWashes.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={refundedWashes}
              fields={fields}
              striped
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'total':
                (item)=>(
                  <td>
                      {item.subtotal + item.checkupCost}
                  </td>
                ),
                'requestedBy':
                (item)=>(
                  <td>
                      {item.userInfo.name}
                  </td>
                ),
                'acceptedBy':
                (item)=>(
                  <td>
                      {item.vendorInfo?item.vendorInfo.firstName+' '+item.vendorInfo.lastName:'---'}
                  </td>
                ),
                'jobRequestedAt':
                (item)=>(
                  <td>
                      {new Date(item.requestedAt).toLocaleString()}
                  </td>
                ),
                'washScheduledAt':
                (item)=>(
                  <td>
                      {new Date(item.time).toLocaleString()}
                  </td>
                ),
                'refund':
                (item)=>(
                  <td>
                      {new Date(item.paidOn).toLocaleString()}
                  </td>
                )
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

export default RefundPayment
