import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
} from '@coreui/react'

const fields = ['name', 'username', 'phone', 'boatBrand', 'boatLength', 'boatBreadth']

const Users = () => {
  const [users, setUsers] = useState([])
  
  async function getUsers() {
    let response = await fetch('https://yatchee.herokuapp.com/fetch/users/user')
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
                <span>Users</span>
                <span>Number of users : {users.length}</span>
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

export default Users
