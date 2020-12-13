import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
} from '@coreui/react'

const fields = ['firstName', 'lastName', 'phone', 'username', 'washTypesProvided', 'servicesProvided']

const Vendors = () => {
  const [users, setUsers] = useState([])
  
  async function getUsers() {
    let response = await fetch('https://yatchee.herokuapp.com/fetch/users/vendor')
    response = await response.json()
    setUsers(response)
  }

  useEffect(()=>{
    getUsers()
  },[])

  return (
    <>
      <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader style={{display:'flex', justifyContent:'space-between'}}>
                <span>Vendors</span>
                <span>Number of vendors : {users.length}</span>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={users}
              fields={fields}
              striped
              itemsPerPage={10}
              pagination
            />
            </CCardBody>
          </CCard>
      </CCol>
    </>
  )
}

export default Vendors
