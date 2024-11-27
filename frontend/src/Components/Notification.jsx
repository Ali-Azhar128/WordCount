import React, { useEffect } from 'react';
import { Snackbar, Button, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDeleteItemMutation, useFindByIDQuery } from '../Slices/paragraphsApiSlice';

const CustomNotification = ({ open, handleClose, message, paraId, setText, setCount, setUrl, setData }) => {
  const { data: paraData, isLoading } = useFindByIDQuery(paraId);
  const [deleteItem, {isLoading: deleteLoading, isError: deleteError}] = useDeleteItemMutation();
  useEffect(() => {
    if (paraData) {
      console.log(paraData, 'final paradata')
      // setText(paraData.paragraph);
      // setCount(paraData.count);
      // setUrl(paraData.pdfLink)
      // const cleanedUrl = text.pdfLink.split('3000')[1];
      // setData(cleanedUrl)
    }
  }, [paraData]);

  const handleView = () => {
    console.log(paraData, 'paraData');
    setText(paraData.paragraph);
    setCount(paraData.count);
    setUrl(paraData.pdfLink)
    const cleanedUrl = paraData.pdfLink.split('3000')[1];
    setData(cleanedUrl)
  }
  const handleDelete = async() => {
    const res = await deleteItem(paraId);
    console.log(res, 'res');
  }
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        sx={{ width: '100%' }}
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