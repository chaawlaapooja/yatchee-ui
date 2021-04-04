import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CFormGroup,
  CLabel,
  CSelect
} from '@coreui/react'

const fields = ['jobID', 'status', 'washType', 'service', 'requestedBy', 'acceptedBy', 'transactionID', 'checkupCost', 'subtotal', 'total', 'washScheduledAt', 'jobRequestedAt']

const Washes = () => {
  const [users, setUsers] = useState([])
  const [filteredWashes, setFilteredWashes] = useState([])
  
  async function getUsers() {
    let response = await fetch('https://yatchee.herokuapp.com/fetchWash',{
          method:'POST',
          body: JSON.stringify({forWhom:'admin'}),
          headers: {
              'Content-Type': 'application/json'
          }
    })
    response = await response.json()
    setUsers(response)
    setFilteredWashes(response)
  }

  useEffect(()=>{
    getUsers()
  },[])

  const handleFilterChange = (e) => {
    let filter = e.target.value;
    if(filter==='none')
        setFilteredWashes(users)
    else
        setFilteredWashes(users.filter(doc=>doc.status===filter))
  }
  return (
    <>
      <CCol xs="12" lg="12">
      <CFormGroup>
                    <CLabel htmlFor="ccmonth">Filter By Job Status</CLabel>
                    <CSelect custom name="status" onChange={(e)=>handleFilterChange(e)}>
                      <option value="none">None</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </CSelect>
                  </CFormGroup>
                
          <CCard>
            <CCardHeader style={{display:'flex', justifyContent:'space-between'}}>
                <span>Washes</span>
                <span>Number of washes : {filteredWashes.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={filteredWashes}
              fields={fields}
              striped
              itemsPerPage={10}
              pagination
              scopedSlots = {{
                'total':
                (item)=>(
                  <td>
                      {item.subtotal + item.checkupCost ?? ''}
                  </td>
                ),
                'requestedBy':
                (item)=>(
                  <td>
                      {item?.userInfo?.name || ''}
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
                      {new Date(item.requestedAt).toLocaleString() || ''}
                  </td>
                ),
                'washScheduledAt':
                (item)=>(
                  <td>
                      {new Date(item.time).toLocaleString() ?? ''}
                  </td>
                ),
              }}
            />
            </CCardBody>
          </CCard>
      </CCol>
    </>
  )
}

export default Washes
