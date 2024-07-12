import React, { useState, ChangeEvent } from 'react';
import { Toolbar, Typography, Paper, Grid, Box, Button } from '@mui/material';

const App: React.FC = () => {
  const [selectedMp3, setSelectedMp3] = useState<File | null>(null);

  const handleMp3Change = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedMp3(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedMp3) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedMp3);

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
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: 0 }}>
      <Toolbar />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '2rem' }}>
            <Typography variant="h4">ZIP 파일 업로드</Typography>
            <input type="file" onChange={handleMp3Change} accept=".zip" />
            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ mt: 2 }}>
              업로드
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
