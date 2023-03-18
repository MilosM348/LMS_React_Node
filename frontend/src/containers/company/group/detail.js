import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  Paper,
  Grid,
  Container,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  IconButton,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {Delete, Search} from '@material-ui/icons'
import { DataGrid } from '@material-ui/data-grid'
import { NotificationManager } from 'react-notifications'

import {useAsync} from '../../../service/utils'
import { getFilter as getStudents } from '../../../api/user'
import { get as getGroup, update as updateGroup } from '../../../api/group'
import Nav from "../../layout/nav_company";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    textTransform: "none",
    fontSize: 15,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));
const SelectedUser = (props) => {
  const {selectedUsers, deleteUserId} = props
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const columns = [
    { id: 'email', label: 'Email', minWidth: 100 },
    { id: 'firstName', label: 'First Name', minWidth: 100 },
    { id: 'lastName', label: 'Last Name', minWidth: 150 },
    { id: 'phone', label: 'Phone', minWidth: 200 },
    { id: 'country', label: 'Country', minWidth: 150 },
    { id: 'action', label: 'Action', minWidth: 170, align: 'center'},
  ]

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <h2 style={{ textAlign: "center", padding: 50 }}>Selected Students</h2>
      <TableContainer className={classes.container} style={{ fontSize: 15 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontSize: 15 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ fontSize: 14, padding: "0px 10px" }}
                        >
                          {column.id === "action" ? (
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteUserId(row._id)}
                            >
                              <Delete className={classes.icon} />
                            </IconButton>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={selectedUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

const AddUser = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const history = useHistory()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(5)
  const [group, setGroup] = useState({})
  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const columns = [
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'firstName', headerName: 'First name', width: 150 },
    { field: 'lastName', headerName: 'Last name', width: 150 },
    { field: 'phone', headerName: 'Phone', width: 100 },
    { field: 'country', headerName: 'Country', width: 100 },
  ]

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  }
  const handleCancel = () => {
    history.push('/company/group')
  }
  const handleSave = () => {
    run(updateGroup({
      _id: group._id,
      learnerIDs: selectedUserIds,
    }))
  }
  const deleteUserId = (id) => {
    const index = selectedUserIds.indexOf(id)
    let tmp = [...selectedUserIds.slice(0, index), ...selectedUserIds.slice(index + 1)]
    setSelectedUserIds(tmp)
    tmp = [...selectedUsers.slice(0, index), ...selectedUsers.slice(index + 1)]
    setSelectedUsers(tmp)
  }

  useEffect(() => {
    (async () => {
      const _group = await getGroup(id)
      setGroup(_group)
      let _users = await getStudents({ companyID: _group.companyID, role: 'student' })
      _users = _users.map((item) => {
        item.id = item._id
        return item
      })
      setUsers(_users)
      if (_group.learnerIDs && _group.learnerIDs.length != 0) {
        setSelectedUserIds(_group.learnerIDs)
        const _selectedUserIds = _group.learnerIDs
        const _selectedUsers = _users.filter((item) => _selectedUserIds.indexOf(item._id) > -1)
        setSelectedUsers(_selectedUsers)
      }
    })();
  }, [id]);
  useEffect(() => {
    const tmp = users.filter((item) => selectedUserIds.indexOf(item.id) > -1);
    setSelectedUsers(tmp);
  }, [selectedUserIds, users]);
  useEffect(() => {
    if (status === 'resolved') {
      NotificationManager.success("Selected users are added successfully!", "Success", 3000);
      history.push('/company/group')
    }
    else if (status === 'rejected') {
      console.log(error)
    }
  }, [status])
  return (
    <>
      <Nav />
      <Container maxWidth="lg">
        <h2 style={{ textAlign: "center", padding: 50 }}>Group Manage</h2>
        <Paper className={classes.root}>
          <Button
            className={classes.button}
            style={{ marginBottom: 10 }}
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className={classes.button}
            style={{ marginBottom: 10, float: 'right' }}
            variant="outlined"
            onClick={handleSave}
          >
            Save
          </Button>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              columns={columns}
              rows={users}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                setSelectedUserIds(newSelection);
              }}
              selectionModel={selectedUserIds}
            />
          </div>
          <SelectedUser
            selectedUsers={selectedUsers}
            deleteUserId={deleteUserId}
          />
        </Paper>
      </Container>
    </>
  );
}

export default AddUser;