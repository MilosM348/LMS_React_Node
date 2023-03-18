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
import { getFilter as getAssignments } from '../../../api/assignment'
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
const SelectedAssignment = (props) => {
  const {selectedAssignments, deleteGroupId} = props
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const columns = [
    { id: "name", label: "Name", minWidth: 100 },
    { id: "image", label: "Image", minWidth: 100 },
    { id: "fee", label: "Fee", minWidth: 50 },
    { id: "owner", label: "Owner", minWidth: 100 },
    { id: "part", label: "Part", minWidth: 50 },
    { id: "action", label: "Action", minWidth: 170, align: "center" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <h2 style={{ textAlign: "center", padding: 50 }}>Selected Assignments</h2>
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
            {selectedAssignments
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
                          ) :
                          column.id === "fee" ? (
                            `$ ${value}`
                            ) :
                          column.id === "image" ? (
                            <img src={row.image} style={{ height: 60 }} />
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
        count={selectedAssignments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

const AddAssignment = () => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  const {id} = useParams()
  const history = useHistory()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(5)
  const [videoGroup, setVideoGroup] = useState({})
  const [assignments, setAssignments] = useState([])
  const [selectedAssignmentIds, setSelectedAssignmentIds] = useState([])
  const [selectedAssignments, setSelectedAssignments] = useState([])
  const columns = [
    { field: "name", headerName: "Name", width: 200 },
    { id: "fee", label: "Fee", minWidth: 50 },
    { id: "owner", label: "Owner", minWidth: 100 },
    { id: "part", label: "Part", minWidth: 50 },
  ];

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  }
  const handleCancel = () => {
    history.push('/company/videoGroup')
  }
  const handleSave = () => {
    run(updateVideoGroup({
      _id: videoGroup._id,
      assignmentIDs: selectedAssignmentIds,
    }))
  }
  const deleteGroupId = (id) => {
    const index = selectedAssignmentIds.indexOf(id)
    let tmp = [...selectedAssignmentIds.slice(0, index), ...selectedAssignmentIds.slice(index + 1)]
    setSelectedAssignmentIds(tmp)
    tmp = [...selectedAssignments.slice(0, index), ...selectedAssignments.slice(index + 1)]
    setSelectedAssignments(tmp)
  }

  useEffect(() => {
    (async () => {
      const _videoGroup = await getVideoGroup(id)
      setVideoGroup(_videoGroup)
      let _assignments = await getAssignments({ companyID: _videoGroup.companyID })
      _assignments = _assignments.map((item) => {
        item.id = item._id
        item.owner = item.owner.name
        if (item?.parts) item.part = item?.parts?.length;
        else item.part = 0;
        return item
      })
      setAssignments(_assignments)
      if (_videoGroup.assignmentIDs && _videoGroup.assignmentIDs.length != 0) {
        setSelectedAssignmentIds(_videoGroup.assignmentIDs)
        const _selectedAssignmentIds = _videoGroup.assignmentIDs
        const _selectedAssignments = _assignments.filter((item) => _selectedAssignmentIds.indexOf(item._id) > -1)
        setSelectedAssignments(_selectedAssignments)
      }
    })();
  }, [id]);
  useEffect(() => {
    const tmp = assignments.filter((item) => selectedAssignmentIds.indexOf(item.id) > -1);
    setSelectedAssignments(tmp);
  }, [selectedAssignmentIds, assignments]);
  useEffect(() => {
    if (status === 'resolved') {
      NotificationManager.success("Selected assignments are added successfully!", "Success", 3000);
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
        <h2 style={{ textAlign: "center", padding: 50 }}>Assignment Manage</h2>
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
              rows={assignments}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              onSelectionModelChange={(newSelection) => {
                setSelectedAssignmentIds(newSelection);
              }}
              selectionModel={selectedAssignmentIds}
            />
          </div>
          <SelectedAssignment
            selectedAssignments={selectedAssignments}
            deleteGroupId={deleteGroupId}
          />
        </Paper>
      </Container>
    </>
  );
}

export default AddAssignment;