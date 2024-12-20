import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParaWithPageNumberQuery } from "../Slices/paragraphsApiSlice";
import { setAllParas } from "../Slices/paragraphsSlice";

const SearchField = ({ setParagraph }) => {
  const [open, setOpen] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [search, setSearch] = useState("");

  //redux
  const pageNumber = useSelector((state) => state.paragraphs.pageNumber);
  const paragraphsFromRedux = useSelector(
    (state) => state.paragraphs.paragraphs
  );
  const {
    data: searchResultsWithPage,
    isLoading: isLoadingWithPage,
    isError: isErrorWithPage,
  } = useSearchParaWithPageNumberQuery({
    keyword: search,
    page: pageNumber,
  });

  const dispatch = useDispatch();

  const getDocs = async () => {
    try {
      const data = await fetch("http://localhost:3000/getAll");
      const res = await data.json();
      setParagraphs(res);
    } catch (error) {
      console.error("Error fetching docs:", error);
      setParagraphs([]);
    }
  };

  useEffect(() => {
    if (paragraphsFromRedux.length > 0) {
      getDocs();
    }
  }, [paragraphsFromRedux]);

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleChange = (event, value) => {
    setSelectedValue(value);
  };

  const handleSearch = (event) => {
    const keyword = event.target.value;
    setSearch(keyword);
    if (keyword && !isLoadingWithPage) {
      dispatch(setAllParas(searchResultsWithPage));
    } else {
      getDocs();
    }
  };

  return (
    <div className="w-full max-w-md">
      <Autocomplete
        onChange={handleChange}
        sx={{ color: "white" }}
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        isOptionEqualToValue={(option, value) => option.para === value.para}
        getOptionLabel={(option) => truncateText(option?.para || "", 75)}
        options={paragraphs}
        loading={loading}
        renderInput={(params) => (
          <TextField
            onChange={(e) => {
              handleSearch(e);
            }}
            {...params}
            label="Search Documents"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default SearchField;
