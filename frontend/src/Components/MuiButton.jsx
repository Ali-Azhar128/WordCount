import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const MuiButton = ({ url, text, loading = false, onClick, refetch }) => {
  const user = useSelector((state) => state.login.userInfo);
  return (
    <div>
      {url ? (
        <LoadingButton
          disabled={user.role === "anonymous"}
          loading={loading}
          type="button"
          onClick={onClick}
          variant="contained"
          sx={{
            mt: 2,
            "&:hover": {
              backgroundColor: "#1565C0",
              color: "white",
            },
            "&.MuiLoadingButton-loading": {
              backgroundColor: "red",
            },
          }}
        >
          {text}
        </LoadingButton>
      ) : (
        <LoadingButton
          disabled={user.role === "anonymous"}
          onClick={() => {
            refetch();
          }}
          loading={loading}
          type="submit"
          variant="contained"
          loadingIndicator={<CircularProgress color="red" size={24} />}
          sx={{
            mt: 2,
            "&.MuiLoadingButton-loading": {
              backgroundColor: "#1565C0",
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
