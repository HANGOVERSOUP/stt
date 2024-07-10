// src/components/DataGridComponent.js
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'question_number', headerName: 'Question Number', width: 150, editable: true },
  { field: 'question', headerName: 'Question', width: 600 },
  { field: 'option_label', headerName: 'option_label', width: 120 },
  { field: 'options', headerName: 'Options', width: 600, renderCell: (params) => params.value.join(', ') },
  
];

const rawData = {
  question_number: [
    'SQ1',
    'SQ1-1',
    'Q1.1'
  ],
  question: [
    '귀하는 작년(2023년)에 ○○훈련기관에서 ◇◇과정으로 직업훈련을 받으신 적이 있습니까?',
    '선생님께서 응답해주신 내용은 해당 훈련기관의 평가에 반영됩니다. 훈련을 받으신 적이 정말 없으신지요?',
    '학습사이트 운영·관리가 적절하였습니까?'
  ],
  option_label: [
    [1,2,3],
    [1,2,3,4,5],
    [1,2,3,4],
  ],
  options: [
    ['받은 적이 있다(80%이상 수료) ☞ 문1로', '받은 적이 없다 ☞ SQ1-1로', '중도포기(80%미만 수료) ☞ [재확인 후, 제출 보고 및 조사종료]'],
    ['받은 적이 있다 ☞ 문1로', '훈련 참여 사실 없음 ☞ [재확인 후, 제출 보고]', '기억 안남 ☞ [재확인 후, 제출 보고]', '응답 거부 ☞ 조사 중단'],
    ['1', '2', '3', '4', '5', '6', '7']
  ],

};

function transformData(data) {
  return data.question_number.map((number, index) => ({
    id: index,
    question_number: number,
    question: data.question[index],
    options: data.options[index],
    option_label: data.option_label[index],
  }));
}

const DataGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});

  useEffect(() => {
    const formattedRows = transformData(rawData);
    setRows(formattedRows);
  }, []);

  const processRowUpdate = (newRow, oldRow) => {
    setEditedRows((prev) => ({
      ...prev,
      [newRow.id]: newRow,
    }));
    return newRow;
  };

  const handleSave = async () => {
    const updatedRows = rows.map((row) => {
      const editedRow = editedRows[row.id];
      return editedRow ? { ...row, ...editedRow } : row;
    });
    console.log('Saving data:', updatedRows);
  
    const jsonData = JSON.stringify(updatedRows);
    const url = new URL('http://116.125.140.82:9000/dummy');
    const params = new URLSearchParams({ data: jsonData });
  
    try {
      const response = await fetch(`${url}?${params}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Response data:', data);
  
    } catch (error) {
      console.error('Error sending data:', error);
    }
  
    setRows(updatedRows);
    setEditedRows({});
  };

  return (
    <>
      <Typography variant="h4">데이터</Typography>
      {/* <Typography variant="h4">a</Typography> */}
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'nowrap',
              overflowX: "auto",
              textOverflow: "ellipsis"
            }
          }}
        />
      </div>
      <Button color="primary" variant="contained" onClick={handleSave} sx={{ mt: '15px', ml: '92%' }}>
        저장하기
      </Button>
    </>
  );
};

export default DataGridComponent;
