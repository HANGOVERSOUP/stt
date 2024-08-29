import React, { useState } from 'react';
import { TextField, AppBar, Toolbar, Typography, Paper, Grid, Box, CssBaseline, Button, Divider, Backdrop, CircularProgress,Dialog,DialogTitle ,
  DialogContent,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; 
import DataGridComponent from '../components/data';
import StatusCheckComponent from '../components/progress'; 
function App() {
  const [projectName, setProjectName] = useState('');
  const [selectedSurveyFile, setSelectedSurveyFile] = useState(null);
  const [selectedMp3, setSelectedMp3] = useState(null);
  const [selectedCati, setSelectedCati] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState('');
  const [xlrange1, setXlrange1] = useState('');
  const [xlrange2, setXlrange2] = useState('');
  const [openProgressDialog, setOpenProgressDialog] = useState(false); 

  const handleMp3Change = (event) => {
    setSelectedMp3(event.target.files[0]);
  };

  const handleCatiChange = (event) => {
    setSelectedCati(event.target.files[0]);
  };

  const handleSurveyChange = (event) => {
    setSelectedSurveyFile(event.target.files[0]);
  };

  const handleUploadAndParse = async () => {
    if (!selectedSurveyFile || !selectedMp3 || !selectedCati) {
      alert('모든 파일을 선택해주세요.');
      return;
    }
  
    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append('files', selectedSurveyFile);
    formData.append('files', selectedMp3);
    formData.append('files', selectedCati);
  
    const uploadUrl = `http://116.125.140.82:9000/upload_files?project_name=${encodeURIComponent(projectName)}`;
    const unzipUrl = `http://116.125.140.82:9000/unzip?project_name=${encodeURIComponent(projectName)}`;
    const parseUrl = `http://116.125.140.82:9000/parse_survey?project_name=${encodeURIComponent(projectName)}`;
  
    try {
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
  
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Error uploading files:', errorText);
        alert('파일 업로드 실패: ' + errorText);
        setLoading(false);
        return;
      }
  
      alert('파일 업로드 성공');
  
      const unzipResponse = await fetch(unzipUrl, {
        method: 'GET',
      });
  
      if (!unzipResponse.ok) {
        const errorText = await unzipResponse.text();
        console.error('Error unzipping files:', errorText);
        alert('파일 압축 해제 실패: ' + errorText);
        setLoading(false);
        return;
      }
  
      alert('파일 압축 해제 성공');
  
      const parseResponse = await fetch(parseUrl, {
        method: 'POST',
      });
  
      if (parseResponse.ok) {
        const data = await parseResponse.json();
        console.log('Survey data received:', data);
        setSurveyData(data.responses);
        console.log("data.responses", data.responses);
      } else {
        const errorText = await parseResponse.text();
        console.error('Error parsing survey:', errorText);
        alert('설문 데이터 파싱 실패: ' + errorText);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      alert('파일 처리 중 오류 발생');
    }
  
    setLoading(false);
  };
  

  const handleDownload = async () => {
    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }
  
    const downloadUrl = `http://116.125.140.82:9000/download?project_name=${encodeURIComponent(projectName)}`;
  
    try {
      const response = await fetch(downloadUrl, {
        method: 'POST',
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName}.xlsx`; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); 
      } else {
        const errorText = await response.text();
        console.error('Error downloading file:', errorText);
        alert('파일 다운로드 실패: ' + errorText);
      }
    } catch (error) {
      console.error('Error processing download:', error);
      alert('파일 다운로드 중 오류 발생');
    }
  };

  const handleOpenProgressDialog = () => {
    setOpenProgressDialog(true);
  };

  const handleCloseProgressDialog = () => {
    setOpenProgressDialog(false);
  };


  return (
    <div style={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" style={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap>
            STT prototype
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 1, mb: 1 }}
            onClick={handleOpenProgressDialog}
          >
            STT진행상황 확인
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 1, marginLeft: 0, mt: 0 }}
      >
        <Toolbar />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" flexDirection="row" height="91.5vh" gap={3} p={3}>
              <Paper
                elevation={3}
                sx={{
                  padding: '1.5rem',
                  minWidth: '200px',
                  marginRight: '0rem',
                  display:'table',
                  minHeight: '800px'
                }}
              >
                <Box sx={{ mt: 0, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    프로젝트명, % 입력
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    label="프로젝트 명"
                    variant="outlined"
                    size="small"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    sx={{ mt: 1 ,width:'100%' }}
                  />
                </Box>
  
                <Box sx={{ mt: 0, mb: 1, display: 'flex', flexDirection: 'col' }}>
                  <TextField
                    id="a"
                    label="% 입력 (숫자만 입력)"
                    variant="outlined"
                    size="small"
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    sx={{ mt: 1 ,width:'100%' }}
                  />
                </Box>
  
                <Divider />
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    설문 파일 업로드, 범위지정
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      TXT 파일 선택
                      <input
                        type="file"
                        hidden
                        onChange={handleSurveyChange}
                        accept=".txt"
                      />
                    </Button>
                    {selectedSurveyFile && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedSurveyFile.name}
                      </Typography>
                    )}
                  </div>
                </Box>
  
                <Box sx={{ mt: 0, mb: 1, display: 'flex', flexDirection: 'col' }}>
                  <TextField
                    id="outlined-basic"
                    label="진행 범위 1"
                    variant="outlined"
                    size="small"
                    value={xlrange1}
                    onChange={(e) => setXlrange1(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="진행 범위 2"
                    variant="outlined"
                    size="small"
                    value={xlrange2}
                    onChange={(e) => setXlrange2(e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
  
                <Divider />
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    CATI 데이터 업로드
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      EXCEL 파일 선택
                      <input
                        type="file"
                        hidden
                        onChange={handleCatiChange}
                        accept=".xlsx, .xls"
                      />
                    </Button>
                    {selectedCati && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedCati.name}
                      </Typography>
                    )}
                  </div>
                </Box>
                <Divider />
                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    음성 파일 업로드
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Button variant="contained" component="label" color="primary">
                      ZIP 파일 선택
                      <input
                        type="file"
                        hidden
                        onChange={handleMp3Change}
                        accept=".zip"
                      />
                    </Button>
                    {selectedMp3 && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        선택된 파일: {selectedMp3.name}
                      </Typography>
                    )}
                  </div>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    파일 업로드 및 파싱
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={handleUploadAndParse}
                  >
                    업로드 및 파싱
                  </Button>
                </Box>
                <Divider />
                <Box sx={{ mt: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    파일 다운로드
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mb: 1 }}
                    onClick={handleDownload}
                  >
                    다운로드
                  </Button>
                </Box>
              </Paper>
  
              <Paper
                elevation={3}
                sx={{ flex: 3, padding: '1.5rem', height: '100%', flexGrow: 1 }}
              >
                <DataGridComponent
                  surveyData={surveyData}
                  projectName={projectName}
                  percent={percent}
                  xlrange1={xlrange1}
                  xlrange2={xlrange2}
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
  
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Progress Dialog */}
      <Dialog open={openProgressDialog} onClose={handleCloseProgressDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          진행상황 확인
          <IconButton
            aria-label="close"
            onClick={handleCloseProgressDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StatusCheckComponent projectName={projectName} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
