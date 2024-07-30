import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Backdrop, CircularProgress } from '@mui/material';
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
    option_number: Array.isArray(item.option_number) ? item.option_number.join(', ') : item.option_number, // Ensure it's a string
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

const DataGridComponent = ({ surveyData, projectName }) => {
  const [rows, setRows] = useState([]);
  const [editedRows, setEditedRows] = useState({});
  const [loading, setLoading] = useState(false);
  const [sttLoading, setSttLoading] = useState(false);

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
    if (!surveyData) {
      console.error('No survey data to send');
      return;
    }

    const updatedRows = rows.map((row) => {
      const editedRow = editedRows[row.id];
      return editedRow ? { ...row, ...editedRow } : row;
    });

    const url = `http://116.125.140.82:9000/parsed_survey_old?project_name=${encodeURIComponent(projectName)}`;

    const requestData = {
      data: surveyData,
    };

    setLoading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response data:', data);

      // Call run_stt after successful save
      setSttLoading(true);
      await fetch(`http://116.125.140.82:9000/run_stt?project_name=${encodeURIComponent(projectName)}`, {
        method: 'POST',
      });
      setSttLoading(false);

    } catch (error) {
      console.error('Error sending data:', error);
      setSttLoading(false);
    }

    setLoading(false);
    setRows(updatedRows);
    setEditedRows({});
  };

  const columns = [
    { field: 'question_label', headerName: 'CATI_컬럼값', width: 140, editable: true },
    { field: 'question_number', headerName: '설문지_문항번호', width: 150, editable: true },
    { field: 'question_context', headerName: '설문_문항내용', width: 330, editable: true },
    { field: 'option_number', headerName: '설문_보기번호', width: 140, editable: true },
    {
      field: 'option',
      headerName: '설문_보기',
      width: 500,
      renderCell: (params) => Array.isArray(params.value) ? params.value.join(', ') : params.value,
      editable: true,
    },
    {
      field: 'actions',
      headerName: '삭제',
      width: 80,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem
          key={params.id + '-delete'}  // Add a unique key for each element
          icon={<Button variant="contained" color="secondary">삭제</Button>}
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />
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
      <Button color="primary" variant="contained" onClick={handleSave} sx={{ mt: '20px', ml: '89%' }}>
        수정사항 저장하기
      </Button>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading || sttLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default DataGridComponent;
