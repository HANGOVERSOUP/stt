import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Paper, Grid, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, IconButton } from '@mui/material';
import { Inbox as InboxIcon, Mail as MailIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';

const drawerWidth = 240;

function App() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleNavigation = (url) => {
    window.location.href = url;
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
            Dashboard
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
            {/* <ListItem button onClick={() => handleNavigation('')} sx={{ mt: '5px' }}> */}
            <ListItem  sx={{ mt: '5px' }}>
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
            <Paper elevation={3} style={{ padding: '2rem' }}>
              <Typography variant="h4">MP3?</Typography>
              <Typography variant="body1"></Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
