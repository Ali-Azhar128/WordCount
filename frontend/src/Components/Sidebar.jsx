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
import { Avatar, Button, Chip, Pagination, Stack, TextField, Tooltip } from '@mui/material';
import { useGetPageQuery, useSearchParaWithPageNumberQuery, useFlagItemMutation, useDeleteItemMutation } from '../Slices/paragraphsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAllParas, setFlaggedItem, setPageNumber, setParagraphId, setUserIdToSendNotificationTo } from '../Slices/paragraphsSlice';
import LanguageIcon from '@mui/icons-material/Language';
import FlagIcon from '@mui/icons-material/Flag';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';


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

export default function PersistentDrawerLeft({ paragraphs, setText, setCount, setUrl, toggle, search, setSearch, setData, setFlagged }) {

const socket = io('http://localhost:3000')
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refetchData, setRefetchData] = useState(false);

  // redux
  const dispatch = useDispatch();
  const para = useSelector(state => state.paragraphs.paragraphs);
  const user = useSelector(state => state.login.userInfo)
  const pageNumber = useSelector(state => state.paragraphs.pageNumber);
  const userId = useSelector(state => state.paragraphs.userId)

  const { data, error, isLoading, refetch: refetchPage } = useGetPageQuery(pageNumber);
  const { data: searchResultsWithPage, isLoading: isLoadingWithPage, refetch } = useSearchParaWithPageNumberQuery({
    keyword: search,
    page: pageNumber,
    userId: user.sub,
  });
  const [flagItem, {isLoading: flagItemLoading, isError}] = useFlagItemMutation();
  const [deleteItem, {isLoading: deleteLoading, isError: deleteError}] = useDeleteItemMutation();

 // router-dom
 const navigate = useNavigate();
  
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const getInitials = () => {
    const nameParts = user.username.split('_');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.username[0].toUpperCase();
  };


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

  const toggleFlagItem = async (e, id, createdBy, flagged) => {
    e.stopPropagation()
    try {
      
      console.log(createdBy, 'createdBy')
      dispatch(setUserIdToSendNotificationTo({createdBy, id}))
      const res = await flagItem(id).unwrap();
      dispatch(setParagraphId(id));
      // if(!flagged) {
      //   socket.emit('sendNotification', {
      //     userId: createdBy, 
      //     message: 'Your paragraph is flagged by an admin'
      //   });
      // }
      
      console.log(flagged, 'text.isFlagged')
      toast.success(res)
      refetchPage()
      console.log('here')
    } catch (error) {
      console.error(error)
      toast.error(error);
    }
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    try {
      console.log(data, 'data before delete')
      const res = await deleteItem(id).unwrap();
      console.log(data, 'data after delete')
      toast.success(res)
      const updatedData = await refetch().unwrap();

       if (updatedData.docs.length === 0 && pageNumber > 1) {
        dispatch(setPageNumber(pageNumber - 1));
      }
      setRefetchData(!refetchData)
      refetchPage()
      refetch()
    } catch (error) {
      console.error(error)
      toast.error(error);
    }
  }


  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  }

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
  if(searchResultsWithPage){
    console.log(searchResultsWithPage.docs, 'total pages')
  }
 }, [searchResultsWithPage])

  useEffect(() => {
    if (data) {
      dispatch(setAllParas(data));
      console.log('data refetched')
    }
  }, [data, dispatch, refetchData]);

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
  }
, [user]);


  return (
    isLoading && isLoadingWithPage ? <div>Loading...</div> : (
      <div className="relative">
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <CustomAppBar className='flex' position="fixed" open={open}>
            <Toolbar className='w-full flex justify-between items-center'>
              <div className='flex items-center'>
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
              </div>
              <div className='flex space-x-2 items-center'>
              {isAdmin && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Analytics
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                 
                </>
              )}
               {user ? (
                <>
                {user.role === 'admin' ? (<Avatar sx={{ m: 1, bgcolor: 'green',
                    borderRadius: '50%',
                   }}>
                  A
                  </Avatar>) : (
                  <Avatar sx={{ m: 1, bgcolor: 'green',
                    borderRadius: '50%',
                   }}>
                  {getInitials()}
                  </Avatar>
                )}
                <LogoutIcon onClick={handleLogout} className='hover cursor-pointer'/>
                
                </>
              ): (<>
                <Button
                variant='contained'
                onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </>)}
            </div>
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
                  <ListItem className={`${text.isFlagged && 'bg-red-600'} ${text.isFlagged && 'text-white'} border-b-2 border border-white`} key={index} disablePadding>
                    <ListItemButton
                     onClick={() => {
                      setText(text.para)
                      setCount(text.count)
                      setUrl(text.pdfLink)
                      const cleanedUrl = text.pdfLink.split('3000')[1];
                      setData(cleanedUrl)
                    }}>
                      <ListItemText 
                        primary={
                          <div className='flex flex-col' style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className='flex justify-between items-center'>
                              <div className='flex space-x-1'>
                                {text.isFlagged && <Tooltip title="Item is flagged" arrow><WarningIcon className='text-sm self-center' sx={{ color: 'white',
                                  fontSize: '14px',
                                  
                                 }} />
                                 </Tooltip>}
                                <span className='text-sm font-semibold'>{truncateText(text.para, 6)}</span>
                              </div>
                            {
                              user && ( 
                                user.role === 'admin' && (
                                  <div className='flex'>
                                    <FlagIcon onClick={(e) => toggleFlagItem(e, text.id, text.createdBy, text.isFlagged)} sx={{ color: text.isFlagged ? 'white' : 'black' }} />
                                    <DeleteIcon onClick={(e) => handleDelete(e, text.id)} sx={{ color: 'black' }} />

                                  </div>
                                )
                              )
                            }
                            </div>
                            <div className='flex space-x-1 justify-end'>
                              <Chip

                                icon={<LanguageIcon/>}
                                sx={{ marginTop: '5px', alignSelf: 'flex-end', variant: 'outlined', backgroundColor: 'yellow' }}
                                label={text.language ? text.language : 'No lang'} 
                                size="small"
                              />
                              <Chip 
                                sx={{ marginTop: '5px', alignSelf: 'flex-end', backgroundColor: '#E0E0E0' }}
                                label={formatDate(text.createdAt)} 
                                size="small" 
                              />
                            </div>
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
                  onChange={(_, page) => dispatch(setPageNumber(page))}
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