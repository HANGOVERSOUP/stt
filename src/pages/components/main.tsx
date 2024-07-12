import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Typography, Paper, Grid, Box, CssBaseline, Button, Divider, Backdrop, CircularProgress } from '@mui/material';
import DataGridComponent from './data';

const App: React.FC = () => {
  const [projectName, setProjectName] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMp3, setSelectedMp3] = useState<File | null>(null);
  const [selectedCati, setSelectedCati] = useState<File | null>(null);
  const [surveyData, setSurveyData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMp3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedMp3(event.target.files[0]);
    }
  };

  const handleCatiChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedCati(event.target.files[0]);
    }
  };

  const handleSurveyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File | null, type: string) => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const url = `http://116.125.140.82:9000/upload_file?project_name=${encodeURIComponent(projectName)}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded successfully:', data);
        alert('파일 업로드 성공');
        if (type === 'survey') {
          await handleParseSurvey();
        }
      } else {
        const errorText = await response.text();
        console.error('Error uploading file:', errorText);
        alert('파일 업로드 실패: ' + errorText);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('파일 업로드 중 오류 발생');
    }
  };

  const handleParseSurvey = async () => {
    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    setLoading(true);

    const url = `http://116.125.140.82:9000/parse_survey?project_name=${encodeURIComponent(projectName)}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Survey data received:', data);
        setSurveyData(data);
      } else {
        const errorText = await response.text();
        console.error('Error parsing survey:', errorText);
        alert('설문 데이터 파싱 실패: ' + errorText);
      }
    } catch (error) {
      console.error('Error parsing survey:', error);
      alert('설문 데이터 파싱 중 오류 발생');
    }

    setLoading(false);
  };

  const handleExecute = async () => {
    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    setLoading(true);

    const url = `http://116.125.140.82:9000/execute?project_name=${encodeURIComponent(projectName)}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Execute response:', data);
        alert('실행 완료');
      } else {
        const errorText = await response.text();
        console.error('Error executing:', errorText);
        alert('실행 실패: ' + errorText);
      }
    } catch (error) {
      console.error('Error executing:', error);
      alert('실행 중 오류 발생');
    }

    setLoading(false);
  };

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>STT prototype</Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 1, marginLeft: 0, mt: 0 }}>
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" height="91.5vh" gap={3} p={3}>
              <Paper elevation={3} style={{ flex: 1, padding: '1.5rem', marginRight: '0rem', height: '100%' }}>
                <Box sx={{ mt: 0, mb: 1 }}>
                  <Typography variant="h5">프로젝트명 입력</Typography>
                  <TextField
                    id="outlined-basic"
                    label="프로젝트 명"
                    variant="outlined"
                    size="small"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h5">설문 파일 업로드</Typography>
                  <div style={{ display: "flex", flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      TXT 파일 선택
                      <input type="file" hidden onChange={handleSurveyChange} accept=".txt" />
                    </Button>
                    {selectedFile && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedFile.name}
                      </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedFile, 'survey')} sx={{ mt: 1, mb: 1 }}>
                      업로드
                    </Button>
                  </div>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h5">CATI 데이터 업로드</Typography>
                  <div style={{ display: "flex", flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      EXCEL 파일 선택
                      <input type="file" hidden onChange={handleCatiChange} accept=".xlsx, .xls" />
                    </Button>
                    {selectedCati && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedCati.name}
                      </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedCati, 'cati')} sx={{ mt: 1, mb: 1 }}>
                      업로드
                    </Button>
                  </div>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h5">음성 파일 업로드</Typography>
                  <div style={{ display: "flex", flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      ZIP 파일 선택
                      <input type="file" hidden onChange={handleMp3Change} accept=".zip" />
                    </Button>
                    {selectedMp3 && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedMp3.name}
                      </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={() => handleUpload(selectedMp3, 'mp3')} sx={{ mt: 1, mb: 1 }}>
                      업로드
                    </Button>
                  </div>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h5">STT 실행/다운로드</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 1, mb: 1 }} onClick={handleExecute}>
                    실행
                  </Button>
                  <Button variant="contained" color="primary" sx={{ mt: 1, mb: 1, ml: 1 }}>
                    다운로드
                  </Button>
                </Box>
              </Paper>

              <Paper elevation={3} style={{ flex: 1, padding: '1.5rem', height: '100%' }}>
                <DataGridComponent surveyData={surveyData} projectName={projectName} />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default App;
