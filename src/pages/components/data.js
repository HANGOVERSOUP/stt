import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { randomId } from '@mui/x-data-grid-generator';

const transformData = (data) => {
  if (!data) return [];
  return data.map((item, index) => ({
    id: index,
    question_label: item.question_label,
    question_number: item.question_number,
    question_context: item.question_context,
    option: item.option,
    option_label: Array.isArray(item.option_number) ? item.option_number.join(', ') : '', 
  }));
};

const EditToolbar = (props) => {
  const { setRows } = props;

  const handleAddClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      { id, question_number: '', question: '', options: [], option_label: '', isNew: true },
    ]);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
};

const DataGridComponent = ({ surveyData, projectName, percent, xlrange1, xlrange2 }) => {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});

  useEffect(() => {
    if (surveyData) {
      const formattedRows = transformData(surveyData);
      setRows(formattedRows);
    }
  }, [surveyData]);

  const processRowUpdate = (newRow, oldRow) => {
    newRow.options = typeof newRow.options === 'string' ? newRow.options.split(',').map(opt => opt.trim()) : newRow.options;
    setEditedRows((prev) => ({
      ...prev,
      [newRow.id]: newRow,
    }));
    return newRow;
  };

  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleSave = async () => {
    const updatedRows = rows.map((row) => {
      const editedRow = editedRows[row.id];
      return editedRow ? { ...row, ...editedRow } : row;
    });
  
    console.log('Saving data:', updatedRows);
  
    const url = `http://116.125.140.82:9000/parsed_survey_old`;
  
    const params = new URLSearchParams({
      project_name: projectName,
      data: JSON.stringify(updatedRows),
    });
  
    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Response data:', result);
  
      await handleRunSTT();
    } catch (error) {
      console.error('Error sending data:', error);
    }
  
    setRows(updatedRows);
    setEditedRows({});
  };
  

  const handleRunSTT = async () => {
    const url = `http://116.125.140.82:9000/run_stt`;

    const params = new URLSearchParams({
      project_name: projectName,
      percent_info: percent,
      start: xlrange1,
      end: xlrange2,
    });

    try {
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('STT execution failed');
      }

      const data = await response.json();
      console.log('STT execution result:', data);

      alert('STT process completed successfully.');
    } catch (error) {
      console.error('Error running STT:', error);
      alert('STT 실행 중 오류 발생');
    }
  };

  const columns = [
    { field: 'question_label', headerName: 'CATI_컬럼값', width: 140, editable: true },
    { field: 'question_number', headerName: '설문지_문항번호', width: 150, editable: true },
    { field: 'question_context', headerName: '설문_문항내용', width: 330, editable: true },
    { field: 'option_label', headerName: '설문_보기번호', width: 140, editable: true },
    {
      field: 'option',
      headerName: '설문_보기',
      width: 500,
      renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : '',
      editable: true,
    },
    {
      field: 'actions',
      headerName: '삭제',
      width: 80,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Button variant="contained" color="secondary">삭제</Button>}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <>
      <Typography variant="h4">데이터</Typography>
      <Box
        sx={{
          height: 600,
          width: '100%',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { setRows },
          }}
        />
      </Box>
      <Button color="primary" variant="contained" onClick={handleSave} sx={{ mt: '20px', ml: '87%' }}>
        수정사항 저장하기
      </Button>
    </>
  );
};

export default DataGridComponent;
