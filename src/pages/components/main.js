import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Paper, Grid, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton, Button, Divider} from '@mui/material';
import { Inbox as InboxIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

const drawerWidth = 240;

function App() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // API 호출하여 파일명 가져오기
    fetch('http://your-api-endpoint/files')
      .then(response => response.json())
      .then(data => {
        setFiles(data.files || []);
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (url) => {
    window.location.href = url;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleApply = () => {
    if (!selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // API 요청 보내기
    fetch('http://your-api-endpoint/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded:', data);
        setFiles([...files, selectedFile.name]); // 새 파일명 추가
        setSelectedFile(null); // 입력 필드 초기화
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div style={{ display: 'flex' }}>
        <CssBaseline />

        <AppBar position="fixed" style={{ zIndex: 1201 }}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="toggle drawer"
                onClick={toggleDrawer}
                edge="start"
            >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap>
                STT prototype
            </Typography>
            </Toolbar>
        </AppBar>

        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="temporary"
            anchor="left"
            open={open}
            onClose={toggleDrawer}
        >
            <Box sx={{ overflow: 'auto' }}>
            <List>
                <ListItem sx={{ mt: '5px' }}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation('http://115.68.193.117:3000/components/main')} sx={{ mt: '5px' }}>
                <ListItemIcon>
                    <StickyNote2Icon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation('http://115.68.193.117:3000/components/mp3set')} sx={{ mt: '5px' }}>
                <ListItemIcon>
                    <QueueMusicIcon />
                </ListItemIcon>
                <ListItemText primary="MP3" />
                </ListItem>
            </List>
            </Box>
        </Drawer>

        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: 0 }}
        >
            <Toolbar />
            <Grid container spacing={3}>
            <Grid item xs={12}>
                <Box display="flex" flexDirection="row" height="88.5vh" gap={3} p={3}>
                    <Paper elevation={3} style={{ flex: 1, padding: '2rem', marginRight: '1.5rem', height: '100%' }}>
                        <Box sx={{mb :3}}>
                            <Typography variant="h4">
                                파일 업로드
                            </Typography>
                        </Box>
                        <Divider/>
                        <Box sx={{mt :3}}>
                            <Typography variant="h5">
                                적용된 파일
                            </Typography>
                            <ul>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                <li key={index}>{file}</li>
                                ))
                            ) : (
                                <Typography variant="body1">
                                    파일이 없습니다.
                                </Typography>
                            )}
                            </ul>
                        </Box>
                        <Divider/>
                        <Box sx={{mt :3}}>
                            <Typography variant="h5">
                                새로운 파일 업로드
                            </Typography>
                            <input type="file" onChange={handleFileChange} />
                            <br/>
                            <Button variant="contained" color="primary" onClick={handleApply} sx={{ mt: 2,mb:2 }}>
                                적용
                            </Button>
                        </Box>
                        <Divider/>
                        <Box sx={{mt :3}}> 
                            <Typography variant="h5">
                                음성파일업로드 페이지 이동
                            </Typography>
                            <Button variant="contained" color="primary" onClick={() => handleNavigation('http://115.68.193.117:3000/components/mp3set')} sx={{ mt: 2 }}>
                                이동
                            </Button>
                        </Box>
                    </Paper>
                    
                    
                    <Paper elevation={3} style={{ flex: 1, padding: '2rem', height: '100%' }}>
                        <Typography variant="h4">세팅</Typography>
                        <Typography variant="body1">인포 표시 공간?</Typography>
                    </Paper>
                </Box>
            </Grid>
            </Grid>
        </Box>
    </div>
  );
}

export default App;
