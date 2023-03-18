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
import { getFilter as getGroups } from '../../../api/group'
import { get as getVideoGroup, update as updateVideoGroup } from '../../../api/videoGroup'
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
  const {selectedGroups, deleteGroupId} = props
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const columns = [
    { id: 'name', label: 'Name', minWidth: 100 },
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
      <h2 style={{ textAlign: "center", padding: 50 }}>Selected Groups</h2>
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
            {selectedGroups
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
                              onClick={() => deleteGroupId(row._id)}
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
        count={selectedGroups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

const AddGroup = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const history = useHistory()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(5)
  const [videoGroup, setVideoGroup] = useState({})
  const [groups, setGroups] = useState([])
  const [selectedGroupIds, setSelectedGroupIds] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
  ]

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  }
  const handleCancel = () => {
    history.push('/company/videoGroup')
  }
  const handleSave = () => {
    run(updateVideoGroup({
      _id: videoGroup._id,
      groupIDs: selectedGroupIds,
    }))
  }
  const deleteGroupId = (id) => {
    const index = selectedGroupIds.indexOf(id)
    let tmp = [...selectedGroupIds.slice(0, index), ...selectedGroupIds.slice(index + 1)]
    setSelectedGroupIds(tmp)
    tmp = [...selectedGroups.slice(0, index), ...selectedGroups.slice(index + 1)]
    setSelectedGroups(tmp)
  }

  useEffect(() => {
    (async () => {
      const _videoGroup = await getVideoGroup(id)
      setVideoGroup(_videoGroup)
      let _groups = await getGroups({ companyID: _videoGroup.companyID })
      _groups = _groups.map((item) => {
        item.id = item._id
        return item
      })
      setGroups(_groups)
      if (_videoGroup.groupIDs && _videoGroup.groupIDs.length != 0) {
        setSelectedGroupIds(_videoGroup.groupIDs)
        const _selectedGroupIds = _videoGroup.groupIDs
        const _selectedGroups = _groups.filter((item) => _selectedGroupIds.indexOf(item._id) > -1)
        setSelectedGroups(_selectedGroups)
      }
    })();
  }, [id]);
  useEffect(() => {
    const tmp = groups.filter((item) => selectedGroupIds.indexOf(item.id) > -1);
    setSelectedGroups(tmp);
  }, [selectedGroupIds, groups]);
  useEffect(() => {
    if (status === 'resolved') {
      NotificationManager.success("Selected groups are added successfully!", "Success", 3000);
      history.push('/company/videoGroup')
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
              rows={groups}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                setSelectedGroupIds(newSelection);
              }}
              selectionModel={selectedGroupIds}
            />
          </div>
          <SelectedUser
            selectedGroups={selectedGroups}
            deleteGroupId={deleteGroupId}
          />
        </Paper>
      </Container>
    </>
  );
}

export default AddGroup;