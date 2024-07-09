import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Paper, Grid, Box, CssBaseline, Button, Divider } from '@mui/material';


import DataGridComponent from '../components/data';


function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMp3, setSelectedMp3] = useState(null);
  const [selectedCati, setSelectedCati] = useState(null);

  const handleMp3Change = (event) => {
    setSelectedMp3(event.target.files[0]);
  };

  const handleCatiChange = (event) => {
    setSelectedCati(event.target.files[0]);
  };

  const handleSurveyChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (file, type) => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (response.ok) {
          alert('파일 업로드 성공');
        } else {
          alert(`파일 업로드 실패: ${data.error}`);
        }
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        alert('파일 업로드 실패: 서버에서 JSON 응답을 받지 못했습니다.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('파일 업로드 중 오류 발생');
    }
  };


  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
            <Typography variant="h6" noWrap>STT prototype</Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: 0 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" height="88.5vh" gap={3} p={3}>
              <Paper elevation={3} style={{ flex: 0.5, padding: '1.5rem', marginRight: '0rem', height: '100%' }}>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h5">적용된 파일</Typography>
                  <ul>
                    {files.length > 0 ? (
                      files.map((file, index) => (
                        <li key={index}>{file}</li>
                      ))
                    ) : (
                      <Typography variant="body1">파일이 없습니다.</Typography>
                    )}
                  </ul>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5">설문 파일 업로드</Typography>

                    <Button variant="contained" component="label" color="primary">
                        TXT 파일 선택
                    <input type="file" hidden onChange={handleSurveyChange} accept=".txt"/>
                    </Button>
                    {selectedFile && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedFile.name}
                    </Typography>
                    )}
                    <br />
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedFile, 'survey')} sx={{ mt: 2, mb: 2 }}>
                        업로드
                    </Button>
                </Box>
                <Divider />
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5">CATI 데이터 업로드</Typography>
                    <Button variant="contained" component="label" color="primary">
                        EXCEL 파일 선택
                        <input type="file" hidden onChange={handleCatiChange} accept=".xlsx, .xls" />
                    </Button>
                    {selectedCati && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedCati.name}
                    </Typography>
                    )}
                    <br />
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedCati, 'cati')} sx={{ mt: 2 , mb: 2 }}>
                        업로드
                    </Button>
                </Box>

                <Divider />
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5">음성 파일 업로드</Typography>

                    <Button variant="contained" component="label" color="primary">
                        ZIP 파일 선택
                        <input type="file" hidden onChange={handleMp3Change} accept=".zip" />
                    </Button>
                    {selectedMp3 && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      선택된 파일: {selectedMp3.name}
                    </Typography>
                    )}
                    <br />
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedMp3, 'mp3')} sx={{ mt: 2 , mb: 2 }}>
                        업로드
                    </Button>
                </Box>
                <Divider />
              </Paper>

              <Paper elevation={3} style={{ flex: 3, padding: '1.5rem', height: '100%' }}>
                <DataGridComponent /> 
              </Paper>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
