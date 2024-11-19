import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const SearchField = ({ setParagraph }) => {
    const [open, setOpen] = useState(false);
    const [paragraphs, setParagraphs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null)

    //redux
    const paragraphsFromRedux = useSelector(state => state.paragraphs.paragraphs)

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
        
            console.log(paragraphsFromRedux, 'from redux')
             getDocs();
      
    }, [])



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

      const searchDocs = async (keyword) => {
        try {
            const data = await fetch(`http://localhost:3000/search?keyword=${keyword}`)
            const res = await data.json()
            setParagraph(res.map(r => r.para))
            console.log(res, 'search res')
        } catch (error) {
            setParagraphs([])
        }
      }

      const handleSearch = (event) => {
        const keyword = event.target.value
        if(keyword){
            searchDocs(keyword)
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