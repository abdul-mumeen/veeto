import React from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { getCustomer, createOrUpdateCustomer } from "../utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CustomerDetailsWithID } from "../typings";
import LoadingScreen from "./LoadingScreen";
interface IFormInput {
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

const Customer: React.FC = () => {
  const { customerId } = useParams();
  return customerId === "new" ? (
    <NewCustomer customerId={customerId} />
  ) : (
    <OldCustomer customerId={customerId} />
  );
};

const NewCustomer: React.FC<{ customerId: string }> = ({ customerId }) => {
  return <CustomerForm {...({ id: customerId } as CustomerDetailsWithID)} />;
};

const OldCustomer: React.FC<{ customerId: string | undefined }> = ({
  customerId,
}) => {
  const { data, status } = useQuery({
    queryKey: ["getCustomer", customerId ?? ""],
    queryFn: getCustomer,
  });

  return status === "pending" ? <div>Loading</div> : <CustomerForm {...data} />;
};

const CustomerForm: React.FC<CustomerDetailsWithID> = (customerDetails) => {
  const { id: customerId, ...otherDetails } = customerDetails;
  const mutation = useMutation({ mutationFn: createOrUpdateCustomer });
  const navigate = useNavigate();
  const isNew = customerId === "new";
  const handleSubmitSuccess = () => navigate("/customers");
  const handleSubmitError = () => mutation.reset();
  const defaultValues =
    !!customerId && !isNew
      ? {
          ...otherDetails,
        }
      : {};
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ defaultValues: defaultValues });
  const onSubmit: SubmitHandler<IFormInput> = (data) =>
    mutation.mutate({ ...data, ...(isNew ? {} : { id: customerId }) });
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Snackbar
          open={mutation.isError}
          autoHideDuration={6000}
          onClose={handleSubmitError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert variant="filled" severity="error" onClose={handleSubmitError}>
            {`There is an error ${
              isNew ? "saving" : "updating"
            } customer details.`}
          </Alert>
        </Snackbar>
        <Snackbar
          open={mutation.isSuccess}
          autoHideDuration={3000}
          onClose={handleSubmitSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            variant="filled"
            severity="success"
            onClose={handleSubmitSuccess}
          >
            {isNew
              ? "Customer created Successfully."
              : "Customer details have been successfully updated."}
          </Alert>
        </Snackbar>
        <LoadingScreen open={mutation.isPending} />
        <Typography variant="h6" gutterBottom>
          Customer Details
        </Typography>
        <Grid
          container
          spacing={3}
          sx={{
            color: "#fff",
            "& .MuiFormControl-root": { color: "#fff" },
            "& .MuiInputLabel-root": { color: "#fff" },
            "& .MuiInput-root::before": { borderColor: "#fff" },
            "& .MuiInput-root::after": { transform: "none" },
            "& .MuiInput-root": { color: "#fff" },
            "& .MuiFormHelperText-root": { color: "red" },
          }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              label="First Name"
              fullWidth
              autoComplete="given-name"
              variant="standard"
              {...register("firstName", { required: true, maxLength: 20 })}
              helperText={errors.firstName ? "First name is too long" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="lastName"
              label="Last name"
              fullWidth
              autoComplete="family-name"
              variant="standard"
              {...register("lastName", { maxLength: 20 })}
              helperText={errors.lastName ? "Last name is too long" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="email"
              label="Email Address"
              fullWidth
              autoComplete="email"
              variant="standard"
              {...register("email", {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              })}
              helperText={errors.email ? "Enter a valid email address" : ""}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="phoneNumber"
              label="Phone Number"
              fullWidth
              autoComplete="phone number"
              variant="standard"
              {...register("phoneNumber", {
                pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
              })}
              helperText={
                errors.phoneNumber
                  ? "Enter valid number ex. +1-374-432-5467"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              label="City"
              fullWidth
              autoComplete="shipping address-level2"
              variant="standard"
              {...register("city", { maxLength: 50 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="state"
              label="State/Province/Region"
              fullWidth
              variant="standard"
              {...register("state", { maxLength: 50 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="postalCode"
              label="Postal code"
              fullWidth
              autoComplete="shipping postal-code"
              variant="standard"
              {...register("postalCode", { maxLength: 8 })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="country"
              label="Country"
              fullWidth
              autoComplete="shipping country"
              variant="standard"
              {...register("country", { maxLength: 50 })}
            />
          </Grid>
        </Grid>
        <Typography variant="h6" gutterBottom>
          <Button
            variant="outlined"
            type="submit"
            size="large"
            sx={{ marginTop: "2rem" }}
          >
            {isNew ? "Submit" : "Update"}
          </Button>
        </Typography>
      </form>
    </>
  );
};

export default Customer;
