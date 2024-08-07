import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

const StatusCheckComponent = () => {
  const [projectName, setProjectName] = useState('');
  const [progress, setProgress] = useState(null);

  const handleCheckStatus = async () => {
    if (!projectName) {
      alert('프로젝트명을 입력해주세요.');
      return;
    }

    const url = `http://116.125.140.82:9000/progress_check?project_name=${encodeURIComponent(projectName)}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      } else {
        const errorText = await response.text();
        console.error('Error fetching progress:', errorText);
        alert('진행 상태를 가져오는 데 실패했습니다: ' + errorText);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      alert('진행 상태를 가져오는 중 오류 발생');
    }
  };

  return (
    <Box sx={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
        진행 상태 확인
      </Typography>
      <TextField
        label="프로젝트 명"
        variant="outlined"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        sx={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleCheckStatus}>
        상태 확인
      </Button>

      {progress && (
        <Box sx={{ marginTop: '2rem' }}>
          <Typography variant="h6">진행 상태</Typography>
          <Typography>전체: {progress.raw_count}</Typography>
          <Typography>완료: {progress.stt_count}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default StatusCheckComponent;
