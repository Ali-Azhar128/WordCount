import React, { useEffect } from "react";
import { Snackbar, Button, Alert } from "@mui/material";
import {
  useDeleteItemMutation,
  useFindByIDQuery,
} from "../Slices/paragraphsApiSlice";

const CustomNotification = ({
  open,
  handleClose,
  message,
  paraId,
  setText,
  setCount,
  setUrl,
  setData,
}) => {
  const { data: paraData, isLoading } = useFindByIDQuery(paraId);
  const [deleteItem, { isLoading: deleteLoading, isError: deleteError }] =
    useDeleteItemMutation();
  const handleView = () => {
    setText(paraData.paragraph);
    setCount(paraData.count);
    setUrl(paraData.pdfLink);
    const cleanedUrl = paraData.pdfLink.split("3000")[1];
    setData(cleanedUrl);
  };
  const handleDelete = async () => {
    const res = await deleteItem(paraId);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{ width: "100%" }}
        action={
          <>
            <Button color="inherit" size="small" onClick={() => handleView()}>
              View
            </Button>
            <Button color="inherit" size="small" onClick={() => handleDelete()}>
              Delete
            </Button>
          </>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomNotification;
