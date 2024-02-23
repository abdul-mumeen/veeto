import React, { useEffect, useState } from "react";
import { getCustomers, deleteCustomer } from "../utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import {
  Edit as EditIcon,
  DeleteOutlineOutlined as DeleteIcon,
} from "@mui/icons-material";
import Pagination from "./Pagination";
import { useNavigate } from "react-router";
import LoadingScreen from "./LoadingScreen";

const Customers: React.FC = () => {
  const [rowCount, setRowCount] = useState(0);
  const [pageSizeState, setPageSizeState] = useState(50);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: pageSizeState,
  });
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: deleteCustomer });
  const [customerIDForDeletion, setCustomerIDForDeletion] =
    useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { data, isFetching, status, refetch, isLoading } = useQuery({
    queryKey: ["getCustomers", paginationModel.page, paginationModel.pageSize],
    queryFn: getCustomers,
  });

  const [customerData, setCustomerData] = useState(data);

  useEffect(() => {
    if (!!data) {
      setCustomerData(data);
    }
  }, [customerData, setCustomerData, data]);

  useEffect(() => {
    if (!isLoading && isFirstLoad && !!data) {
      setIsFirstLoad(false);
    }
  }, [isFirstLoad, isLoading, setIsFirstLoad, data]);

  useEffect(() => {
    setRowCount((previousRowCount) =>
      data?.totalCount !== undefined ? data.totalCount : previousRowCount
    );
  }, [data?.totalCount, setRowCount]);

  const handleDeleteClick = (id: any) => {
    setCustomerIDForDeletion(id);
    setShowDeleteDialog(true);
  };
  const handleEditClick = (id: any) => {
    navigate(`/customers/${id}`);
  };
  const handleDeleteRecord = (shouldDeleteRecord: boolean) => {
    if (shouldDeleteRecord && !!customerIDForDeletion) {
      mutation.mutate(customerIDForDeletion, {
        onSuccess: () => {
          refetch();
        },
      });
    }
    setShowDeleteDialog(false);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      sortable: false,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
      sortable: false,
    },
    { field: "email", headerName: "Email", width: 300, sortable: false },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 200,
      sortable: false,
    },
    {
      field: "postalCode",
      headerName: "Postal Code",
      width: 100,
      sortable: false,
    },
    {
      field: "city",
      headerName: "City",
      width: 100,
      sortable: false,
    },
    {
      field: "state",
      headerName: "State",
      width: 100,
      sortable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 100,
      sortable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <Box sx={{ height: "calc(100vh - 200px)" }}>
      {(status == "pending" || !customerData) && isFirstLoad ? (
        <div>Loading</div>
      ) : status === "error" ? (
        <div>Error</div>
      ) : (
        <>
          <Snackbar
            open={mutation.isError}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            onClose={() => mutation.reset()}
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => mutation.reset()}
            >
              Error deleting customer record. Try again!
            </Alert>
          </Snackbar>
          <Snackbar
            open={mutation.isSuccess}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={() => mutation.reset()}
          >
            <Alert
              variant="filled"
              severity="success"
              onClose={() => mutation.reset()}
            >
              Customer Record has been succcessfully deleted.
            </Alert>
          </Snackbar>
          <LoadingScreen open={mutation.isPending} />
          <Dialog
            open={showDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Delete customer's details?`}
            </DialogTitle>
            <DialogActions>
              <Button onClick={() => handleDeleteRecord(true)}>Yes</Button>
              <Button onClick={() => handleDeleteRecord(false)} autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
          <DataGrid
            rows={customerData.customers ?? []}
            loading={isFetching}
            columns={columns}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
              pagination: { paginationModel: { pageSize: 50 } },
            }}
            pageSizeOptions={[50, 100]}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            disableRowSelectionOnClick
            rowCount={rowCount}
            disableColumnMenu
            sx={{
              border: 1,
              borderLeft: 0,
              borderRight: 0,
              borderRadius: 0,
              color: "white",
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#595858",
              },
              "& .MuiDataGrid-columnHeader:hover": {
                border: "none",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
            }}
            slots={{
              pagination: Pagination,
              loadingOverlay: LinearProgress,
            }}
          />
        </>
      )}
    </Box>
  );
};

export default Customers;
