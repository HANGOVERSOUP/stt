import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp, GridRowModel, GridValidRowModel, GridPaginationModel } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'question_number', headerName: 'Question Number', width: 150, editable: true },
  { field: 'question', headerName: 'Question', width: 600, editable: true },
  { field: 'option_label', headerName: 'Option Label', width: 140, editable: true },
  { field: 'options', headerName: 'Options', width: 600, renderCell: (params) => (params.value as string[]).join(', '), editable: true },
];

interface SurveyData {
  question_number: string[];
  question: string[];
  option_label: string[];
  options: string[][];
}

interface DataGridComponentProps {
  surveyData: SurveyData | null;
  projectName: string;
}

const transformData = (data: SurveyData | null): GridRowModel[] => {
  if (!data || !data.question_number) return [];
  return data.question_number.map((number, index) => ({
    id: index,
    question_number: number,
    question: data.question[index] || '',
    options: data.options[index] || [],
    option_label: data.option_label[index] || '',
  }));
};

const DataGridComponent: React.FC<DataGridComponentProps> = ({ surveyData, projectName }) => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [editedRows, setEditedRows] = useState<Record<number, GridRowModel>>({});
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  useEffect(() => {
    if (surveyData) {
      const formattedRows = transformData(surveyData);
      setRows(formattedRows);
    }
  }, [surveyData]);

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    setEditedRows((prev) => ({
      ...prev,
      [newRow.id]: newRow,
    }));
    return newRow;
  };

  const handleSave = async () => {
    const updatedRows = rows.map((row) => {
      const editedRow = editedRows[row.id as number];
      return editedRow ? { ...row, ...editedRow } : row;
    });
    console.log('Saving data:', updatedRows);

    const jsonData = JSON.stringify(updatedRows);
    const url = new URL('http://116.125.140.82:9000/parsed_survey');
    const params = new URLSearchParams({ data: jsonData, project_name: projectName });

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
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10]}
          disableRowSelectionOnClick
          processRowUpdate={processRowUpdate}
        />
      </div>
      <Button color="primary" variant="contained" onClick={handleSave} sx={{ mt: '20px', ml: '89%' }}>
        수정사항 저장하기
      </Button>
    </>
  );
};

export default DataGridComponent;
