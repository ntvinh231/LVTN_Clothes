import { Button, Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from 'antd-table-saveas-excel';
import { useMemo } from 'react';

const TableComponent = (props) => {
	const {
		selectionType = 'checkbox',
		dataTable: dataSource = [],
		columns = [],
		isLoading = false,
		handleDeleteMany,
	} = props;

	const newColumnExport = useMemo(() => {
		const arr = columns?.filter((col) => col.dataIndex !== 'action');
		return arr;
	}, [columns]);

	const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setRowSelectedKeys(selectedRowKeys);
		},
		getCheckboxProps: (record) => ({
			disabled: record.name === 'Disabled User',
			name: record.name,
		}),
	};

	const handleDeleteAll = () => {
		handleDeleteMany(rowSelectedKeys);
	};

	console.log(props.children);
	const exportExcel = () => {
		const excel = new Excel();
		excel
			.addSheet('test')
			.addColumns(newColumnExport)
			.addDataSource(Array.isArray(dataSource) ? dataSource : [], {
				str2Percent: true,
			})
			.saveAs('Excel.xlsx');
	};

	return (
		<Loading isLoading={isLoading}>
			{rowSelectedKeys.length > 0 && (
				<div
					style={{
						background: '#1d1ddd',
						color: '#fff',
						fontWeight: 'bold',
						padding: '10px',
						cursor: 'pointer',
					}}
					onClick={handleDeleteAll}
				>
					Xóa tất cả
				</div>
			)}
			<Button onClick={exportExcel}>Export excel</Button>
			<Table
				key={dataSource.key}
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={dataSource}
				{...props}
			/>
		</Loading>
	);
};

export default TableComponent;
