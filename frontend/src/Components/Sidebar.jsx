import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SortIcon from '@mui/icons-material/Sort';
import { Chip, Pagination, Stack, TextField } from '@mui/material';
import { useGetPageQuery, useSearchParaWithPageNumberQuery } from '../Slices/paragraphsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAllParas, setPageNumber } from '../Slices/paragraphsSlice';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const CustomAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const ListContainer = styled('div')({
  flex: 1,
  overflowY: 'auto',
});

const PaginationContainer = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  '& .MuiPagination-ul': {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },
  },
  '& .MuiPaginationItem-root': {
    minWidth: '30px',
    height: '30px',
    fontSize: '0.8rem',
  }
}));

export default function PersistentDrawerLeft({ paragraphs, setText, setCount, setUrl, toggle, search, setSearch }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const para = useSelector(state => state.paragraphs.paragraphs);
  const pageNumber = useSelector(state => state.paragraphs.pageNumber);
  const { data, error, isLoading } = useGetPageQuery(pageNumber);
  const { data: searchResultsWithPage, isLoading: isLoadingWithPage } = useSearchParaWithPageNumberQuery({
    keyword: search,
    page: pageNumber
  });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const getDocs = async () => {
    try {
      const data = await fetch('http://localhost:3000/getAll');
      const res = await data.json();
      dispatch(setAllParas(res));
    } catch (error) {
      console.error('Error fetching docs:', error);
      dispatch(setAllParas([]));
    }
  };

  const truncateText = (text, maxWords) => {
    if (typeof text !== 'string') return '';
    const words = text.split(' ');
    if (words.length > maxWords) {
      return `${words.slice(0, maxWords).join(' ')}...`;
    }
    return text;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    if (data) {
      dispatch(setAllParas(data));
    }
  }, [data, dispatch]);

  return (
    isLoading && isLoadingWithPage ? <div>Loading...</div> : (
      <div className="relative">
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <CustomAppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Word Count
              </Typography>
            </Toolbar>
          </CustomAppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader className="w-full">
              <div className="flex justify-between items-center w-full">
                <IconButton onClick={toggle}>
                  <SortIcon />
                </IconButton>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
            </DrawerHeader>
            <div className="px-2 py-2">
              <TextField
                fullWidth
                size="small"
                label="Search Documents"
                onChange={(e) => {
                  const keyword = e.target.value;
                  setSearch(keyword);
                  if (keyword && !isLoadingWithPage) {
                    dispatch(setAllParas(searchResultsWithPage.docs));
                  } else {
                    // getDocs();
                  }
                }}
                InputProps={{
                  sx: {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </div>
            <Divider />
            <ListContainer>
              <List>
                {para.map((text, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => {
                      setText(text.para)
                      setCount(text.count)
                      setUrl(text.pdfLink)
                    }}>
                      <ListItemText 
                        primary={
                          <div className='flex flex-col' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{truncateText(text.para, 10)}</span>
                            <Chip 
                              sx={{ marginTop: '5px', alignSelf: 'flex-end' }}
                              label={formatDate(text.createdAt)} 
                              size="small" 
                            />
                          </div>
                        } 
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </ListContainer>
            <PaginationContainer>
              <Stack spacing={0} alignItems="center">
                <Pagination 
                  page={pageNumber}
                  count={!isLoadingWithPage && searchResultsWithPage ? searchResultsWithPage.totalPages : 0} 
                  size="small"
                  siblingCount={0}
                  boundaryCount={1}
                  onChange={(event, page) => dispatch(setPageNumber(page))}
                />
              </Stack>
            </PaginationContainer>
          </Drawer>
          <Main open={open}></Main>
        </Box>
      </div>
    )
  );
}