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

const fields = ['jobID',  'washType', 'service', 'requestedBy', 'acceptedBy', 'transactionID', 'checkupCost', 'subtotal', 'total', 'washScheduledAt', 'jobRequestedAt', 'pay']

const MakePayment = () => {
  const [pendingPayments, setPendingPayments] = useState([])
  const [paymentsDone, setPaymentsDone] = useState([])
  const [toasts, setToasts] = useState([])
  
  async function getPayments() {
    let response = await fetch('https://yatchee.herokuapp.com/fetchWash',{
          method:'POST',
          body: JSON.stringify({forWhom:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    let responsePending = (response.filter(wash=> wash.isCancelled===false && wash.status==='completed' && wash.isVendorPaid===false))
    let responseDone = (response.filter(wash=>wash.isCancelled===false && wash.isVendorPaid===true))
    setPendingPayments(responsePending)
    setPaymentsDone(responseDone)
  }

  useEffect(()=>{
    getPayments()
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
  const handlePay = async(_id) => {
    let response = await fetch('https://yatchee.herokuapp.com/makePayment',{
          method:'POST',
          body: JSON.stringify({_id, purpose:'pay'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    if(response==='success'){
        getPayments()
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
                <span>Pending Payments</span>
                <span>Number of pending payments : {pendingPayments.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={pendingPayments}
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
                'pay':
                (item)=>(
                    <td>
                        <CButton type="submit" size="sm" color="info" onClick={()=>handlePay(item._id)}> Pay {(0.7 * (item.subtotal + item.checkupCost)).toFixed(2)} </CButton>
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
                <span>Payments Done</span>
                <span>Number of payments done : {paymentsDone.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={paymentsDone}
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
                'pay':
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

export default MakePayment
