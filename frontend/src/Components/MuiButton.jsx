import LoadingButton from '@mui/lab/LoadingButton';

const MuiButton = ({ url, text, loading = false, onClick, refetch }) => {
  return (
    <div>
      {url ? (
       <LoadingButton
         loading={loading}
         type="button"
         onClick={onClick}
         variant="contained"
         sx={{
           mt: 2,
           '&:hover': {
             backgroundColor: '#1565C0',
             color: 'white', 
           },
           '&.MuiLoadingButton-loading': {
             backgroundColor: '#1565C0',
           },
         }}
       >
         {text}
       </LoadingButton>
      ) : (
        <LoadingButton
        onClick={() => {
          console.log('hereeee')
          refetch()
        }}
          loading={loading}
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            '&.MuiLoadingButton-loading': {
              backgroundColor: '#1565C0',
            },
          }}
        >
          {text}
        </LoadingButton>
      )}
    </div>
  );
};

export default MuiButton;