import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParagraphsQuery } from '../Slices/paragraphsApiSlice';
import { setAllParas } from '../Slices/paragraphsSlice';

const SearchField = ({ setParagraph }) => {
    const [open, setOpen] = useState(false);
    const [paragraphs, setParagraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null)
    const [search, setSearch] = useState('')

    //redux
    // const { data: searchResults, isLoading, isError } = useSearchParagraphsQuery(search)
    const pageNumber = useSelector(state => state.paragraphs.pageNumber)
    const paragraphsFromRedux = useSelector(state => state.paragraphs.paragraphs)
     const user = useSelector(state => state.login.userInfo)
    const { data: searchResultsWithPage, isLoading: isLoadingWithPage, isError: isErrorWithPage } = useSearchParagraphsQuery({
        keyword: search, 
        page: pageNumber
    })


    const dispatch = useDispatch()

    const getDocs = async () => {
        try {
            const data = await fetch('http://localhost:3000/getAll');
            const res = await data.json();
            setParagraphs(res); 
        } catch (error) {
            console.error('Error fetching docs:', error);
            setParagraphs([]);
        }
    };

    useEffect(() => {
        
            if(paragraphsFromRedux.length > 0){
                console.log(paragraphsFromRedux, 'from redux')
                getDocs();
            }
      
    }, [paragraphsFromRedux])

    useEffect(() => {
        console.log(pageNumber, 'pageNumber')
        console.log(searchResultsWithPage, 'searchResultsWithPage')
    }, [searchResultsWithPage, pageNumber])



    const handleOpen = async() => {
        setOpen(true);
        // setLoading(true);
        // await getDocs();
        // setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      };

      const handleChange = (event, value) => {
        setSelectedValue(value)
        console.log('selected value: ', value.para)
      }

      const handleSearch = (event) => {
        const keyword = event.target.value
        setSearch(keyword)
        if(keyword && !isLoadingWithPage){
            dispatch(setAllParas(searchResultsWithPage))

        } else{
            getDocs()
        }
      }

    return (
        <div className="w-full max-w-md">
            <Autocomplete
            onChange={handleChange}
                sx={{ color: 'white'}}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                isOptionEqualToValue={(option, value) => option.para === value.para}
                getOptionLabel={(option) => truncateText(option?.para || '', 75)} 
                options={paragraphs}
                loading={loading}
                
                renderInput={(params) => (
                    <TextField
                    onChange={(e) => {
                        console.log(e.target.value)
                        handleSearch(e)
                    }}
                        {...params}
                        label="Search Documents"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
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